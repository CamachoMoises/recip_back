import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import mysql from 'mysql2/promise';

/*
 * Analiza exámenes duplicados (solo lectura).
 *
 * Agrupa los `test` de cursos de teoría (`course_type_id = 1` por defecto) por
 * huella de contenido: banco de preguntas activas + respuestas activas +
 * blueprint (`test_question_type`). No modifica la base de datos.
 *
 * Uso:
 *   node scripts/analyzeDuplicateTests.js
 *   node scripts/analyzeDuplicateTests.js --json
 *   node scripts/analyzeDuplicateTests.js --out reporte.json --json
 *   node scripts/analyzeDuplicateTests.js --sql
 *   node scripts/analyzeDuplicateTests.js --course-type 1 --min-questions 5
 *   node scripts/analyzeDuplicateTests.js --include-inactive-tests
 *
 * El bloque `--sql` solo imprime sentencias propuestas para consolidar:
 * vincula el examen canónico a los cursos de los duplicados y desactiva los
 * duplicados. No borra preguntas, respuestas ni intentos. Requiere que la tabla
 * `course_test` exista (migración 20261202000000-create-course-test.cjs).
 */

const DEFAULTS = {
	courseType: 1,
	minQuestions: 1,
	includeInactiveTests: false,
	json: false,
	out: null,
	sql: false,
};

const parseArgs = (argv) => {
	const options = { ...DEFAULTS };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === '--json') options.json = true;
		else if (arg === '--sql') options.sql = true;
		else if (arg === '--include-inactive-tests')
			options.includeInactiveTests = true;
		else if (arg === '--course-type')
			options.courseType = Number(argv[++i]);
		else if (arg === '--min-questions')
			options.minQuestions = Number(argv[++i]);
		else if (arg === '--out') options.out = argv[++i];
		else if (arg === '--help' || arg === '-h') {
			printHelp();
			process.exit(0);
		} else {
			console.error(`Argumento desconocido: ${arg}`);
			printHelp();
			process.exit(1);
		}
	}
	if (!Number.isInteger(options.courseType) || options.courseType <= 0) {
		throw new Error('--course-type debe ser un entero positivo');
	}
	if (!Number.isInteger(options.minQuestions) || options.minQuestions < 0) {
		throw new Error('--min-questions debe ser un entero >= 0');
	}
	return options;
};

const printHelp = () => {
	console.log(`Uso: node scripts/analyzeDuplicateTests.js [opciones]

  --course-type <id>          Tipo de curso a analizar (default: 1)
  --min-questions <n>         Ignorar exámenes con menos de n preguntas activas (default: 1)
  --include-inactive-tests    Incluir exámenes con status = 0 (default: solo activos)
  --json                      Salida JSON
  --out <archivo>             Guardar la salida en un archivo
  --sql                       Imprimir SQL propuesto de consolidación
  -h, --help                  Esta ayuda

Solo lectura: no escribe en la base de datos.`);
};

const createConnection = async () =>
	mysql.createConnection({
		host: process.env.DB_HOST_CLEVER,
		user: process.env.DB_USER_CLEVER,
		password: process.env.DB_PASSWORD_CLEVER,
		database: process.env.DB_NAME_CLEVER,
		port: Number(process.env.DB_PORT_CLEVER),
	});

const tableExists = async (connection, table) => {
	const [rows] = await connection.query(
		`SELECT COUNT(*) AS total
		 FROM information_schema.TABLES
		 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
		[table],
	);
	return Number(rows[0].total) > 0;
};

const normalizeText = (value) =>
	String(value ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim();

const sha256 = (value) =>
	crypto.createHash('sha256').update(value).digest('hex');

const questionFingerprint = (question) => {
	const answers = question.answers
		.filter((answer) => answer.status !== 0)
		.map(
			(answer) =>
				`${normalizeText(answer.value)}::${answer.is_correct ? 1 : 0}`,
		)
		.sort();
	return [
		question.question_type_id,
		normalizeText(question.header),
		answers.join('||'),
	].join('|');
};

const blueprintFingerprint = (blueprint) =>
	blueprint
		.filter((row) => row.status !== 0)
		.map(
			(row) =>
				`${row.question_type_id}:${row.amount}:${row.value}`,
		)
		.sort()
		.join('|');

const fetchTests = async (connection, { courseType, includeInactiveTests }) => {
	const whereStatus = includeInactiveTests ? '' : 'AND t.status = 1';
	const [rows] = await connection.query(
		`SELECT t.id, t.code, t.status, t.duration, t.min_score,
		        t.course_id, t.created_at,
		        c.name AS course_name, c.code AS course_code,
		        c.course_type_id
		 FROM test t
		 JOIN course c ON c.id = t.course_id
		 WHERE c.course_type_id = ? ${whereStatus}
		 ORDER BY t.id ASC`,
		[courseType],
	);
	return rows;
};

const fetchQuestions = async (connection, testIds) => {
	if (!testIds.length) return [];
	const [rows] = await connection.query(
		`SELECT q.test_id, q.id AS question_id, q.header,
		        q.question_type_id, q.status AS question_status,
		        a.id AS answer_id, a.value, a.is_correct,
		        a.status AS answer_status
		 FROM question q
		 LEFT JOIN answer a ON a.question_id = q.id
		 WHERE q.test_id IN (?)
		 ORDER BY q.test_id ASC, q.id ASC, a.id ASC`,
		[testIds],
	);
	return rows;
};

const fetchBlueprints = async (connection, testIds) => {
	if (!testIds.length) return [];
	const [rows] = await connection.query(
		`SELECT test_id, question_type_id, amount, value, status
		 FROM test_question_type
		 WHERE test_id IN (?)
		 ORDER BY test_id ASC, question_type_id ASC`,
		[testIds],
	);
	return rows;
};

const fetchAttempts = async (connection, testIds) => {
	if (!testIds.length) return new Map();
	const [rows] = await connection.query(
		`SELECT test_id, COUNT(*) AS attempts
		 FROM course_student_test
		 WHERE test_id IN (?)
		 GROUP BY test_id`,
		[testIds],
	);
	return new Map(rows.map((row) => [row.test_id, Number(row.attempts)]));
};

const fetchLinks = async (connection, testIds, hasCourseTest) => {
	const links = new Map();
	if (!hasCourseTest || !testIds.length) return links;
	const [rows] = await connection.query(
		`SELECT ct.test_id, ct.course_id, c.name AS course_name,
		        c.code AS course_code
		 FROM course_test ct
		 JOIN course c ON c.id = ct.course_id
		 WHERE ct.test_id IN (?)
		 ORDER BY ct.test_id ASC, ct.course_id ASC`,
		[testIds],
	);
	for (const row of rows) {
		if (!links.has(row.test_id)) links.set(row.test_id, []);
		links.get(row.test_id).push({
			course_id: row.course_id,
			course_name: row.course_name,
			course_code: row.course_code,
		});
	}
	return links;
};

const buildAnalysis = ({
	tests,
	questionRows,
	blueprintRows,
	attempts,
	links,
}) => {
	const questionsByTest = new Map();
	for (const row of questionRows) {
		if (!questionsByTest.has(row.test_id)) {
			questionsByTest.set(row.test_id, new Map());
		}
		const questions = questionsByTest.get(row.test_id);
		if (!questions.has(row.question_id)) {
			questions.set(row.question_id, {
				question_type_id: row.question_type_id,
				header: row.header,
				status: row.question_status,
				answers: [],
			});
		}
		if (row.answer_id !== null) {
			questions.get(row.question_id).answers.push({
				value: row.value,
				is_correct: Boolean(row.is_correct),
				status: row.answer_status,
			});
		}
	}

	const blueprintsByTest = new Map();
	for (const row of blueprintRows) {
		if (!blueprintsByTest.has(row.test_id)) {
			blueprintsByTest.set(row.test_id, []);
		}
		blueprintsByTest.get(row.test_id).push(row);
	}

	const analyzed = tests.map((test) => {
		const questions = [
			...(questionsByTest.get(test.id)?.values() ?? []),
		];
		const activeQuestions = questions.filter(
			(question) => question.status !== 0,
		);
		const activeAnswers = activeQuestions.reduce(
			(total, question) =>
				total +
				question.answers.filter((answer) => answer.status !== 0)
					.length,
			0,
		);
		const questionFingerprints = activeQuestions
			.map(questionFingerprint)
			.sort();
		const blueprint = blueprintFingerprint(
			blueprintsByTest.get(test.id) ?? [],
		);
		const fingerprint = sha256(
			JSON.stringify({
				questions: questionFingerprints,
				blueprint,
			}),
		);

		return {
			id: test.id,
			code: test.code,
			status: Boolean(test.status),
			course_id: test.course_id,
			course_name: test.course_name,
			course_code: test.course_code,
			duration: test.duration,
			min_score: test.min_score,
			created_at: test.created_at,
			question_count: activeQuestions.length,
			answer_count: activeAnswers,
			attempt_count: attempts.get(test.id) ?? 0,
			linked_courses: links.get(test.id) ?? [
				{
					course_id: test.course_id,
					course_name: test.course_name,
					course_code: test.course_code,
				},
			],
			fingerprint,
		};
	});

	return analyzed;
};

const groupDuplicates = (tests, minQuestions) => {
	const eligible = tests.filter(
		(test) => test.question_count >= minQuestions,
	);
	const groups = new Map();
	for (const test of eligible) {
		if (!groups.has(test.fingerprint)) groups.set(test.fingerprint, []);
		groups.get(test.fingerprint).push(test);
	}
	return [...groups.values()]
		.filter((group) => group.length > 1)
		.map((group) => {
			const sorted = [...group].sort(
				(a, b) =>
					b.attempt_count - a.attempt_count ||
					b.question_count - a.question_count ||
					a.id - b.id,
			);
			const canonical = sorted[0];
			const duplicates = sorted.slice(1);
			const redundantQuestions = duplicates.reduce(
				(total, test) => total + test.question_count,
				0,
			);
			const redundantAnswers = duplicates.reduce(
				(total, test) => total + test.answer_count,
				0,
			);
			return {
				fingerprint: canonical.fingerprint,
				question_count: canonical.question_count,
				answer_count: canonical.answer_count,
				canonical,
				duplicates,
				redundant_questions: redundantQuestions,
				redundant_answers: redundantAnswers,
				courses_to_link: [
					...new Map(
						duplicates.flatMap((test) =>
							test.linked_courses.map((course) => [
								course.course_id,
								course,
							]),
						),
					).values(),
				],
			};
		})
		.sort((a, b) => b.redundant_questions - a.redundant_questions);
};

const buildSql = (groups) => {
	if (!groups.length) return '-- No se encontraron exámenes duplicados.\n';
	const lines = [
		'-- Consolidación propuesta por analyzeDuplicateTests.js',
		'-- Revisar antes de ejecutar. Requiere la tabla course_test.',
		'',
	];
	for (const group of groups) {
		lines.push(
			`-- Grupo ${group.canonical.id}: ${group.canonical.code} (${group.canonical.question_count} preguntas)`,
		);
		for (const course of group.courses_to_link) {
			lines.push(
				`INSERT INTO course_test (course_id, test_id, created_at, updated_at)
 VALUES (${course.course_id}, ${group.canonical.id}, NOW(), NOW())
 ON DUPLICATE KEY UPDATE test_id = VALUES(test_id);`,
			);
		}
		const duplicateIds = group.duplicates.map((test) => test.id);
		lines.push(
			`UPDATE test SET status = 0 WHERE id IN (${duplicateIds.join(', ')});`,
		);
		lines.push(
			'-- Los tests duplicados se conservan para no perder intentos/historial.',
		);
		lines.push('');
	}
	return lines.join('\n');
};

const buildMarkdown = ({ options, tests, groups, hasCourseTest }) => {
	const lines = [];
	lines.push('# Reporte de exámenes duplicados');
	lines.push('');
	lines.push(`- Tipo de curso analizado: \`${options.courseType}\``);
	lines.push(`- Tests analizados: \`${tests.length}\``);
	lines.push(`- Grupos duplicados: \`${groups.length}\``);
	lines.push(
		`- Tests duplicados (no canónicos): \`${groups.reduce(
			(total, group) => total + group.duplicates.length,
			0,
		)}\``,
	);
	lines.push(
		`- Preguntas redundantes: \`${groups.reduce(
			(total, group) => total + group.redundant_questions,
			0,
		)}\``,
	);
	lines.push(
		`- Respuestas redundantes: \`${groups.reduce(
			(total, group) => total + group.redundant_answers,
			0,
		)}\``,
	);
	lines.push(
		`- Tabla \`course_test\`: ${hasCourseTest ? 'existe' : 'no existe (se usa el curso dueño como vínculo)'}`,
	);
	lines.push('');

	if (!groups.length) {
		lines.push('No se encontraron exámenes duplicados con los filtros actuales.');
		return lines.join('\n');
	}

	for (const group of groups) {
		lines.push(
			`## Grupo ${group.canonical.code} (test ${group.canonical.id})`,
		);
		lines.push('');
		lines.push(
			`- Preguntas activas: \`${group.question_count}\``,
		);
		lines.push(`- Respuestas activas: \`${group.answer_count}\``);
		lines.push(
			`- Canónico sugerido: **test ${group.canonical.id}** (\`${group.canonical.code}\`, curso ${group.canonical.course_id} ${group.canonical.course_name})`,
		);
		lines.push('');
		lines.push(
			'| test | código | curso | estado | preguntas | respuestas | intentos |',
		);
		lines.push('|---:|---|---|---|---:|---:|---:|');
		for (const test of [group.canonical, ...group.duplicates]) {
			lines.push(
				`| ${test.id} | ${test.code} | ${test.course_id} ${test.course_name} | ${test.status ? 'activo' : 'inactivo'} | ${test.question_count} | ${test.answer_count} | ${test.attempt_count} |`,
			);
		}
		lines.push('');
		lines.push('Cursos a vincular al canónico:');
		for (const course of group.courses_to_link) {
			lines.push(
				`- ${course.course_id} ${course.course_name} (\`${course.course_code ?? ''}\`)`,
			);
		}
		lines.push('');
		lines.push(
			'Acción sugerida: vincular el canónico a esos cursos y dejar los duplicados con `status = 0`. No borrar preguntas, respuestas ni intentos.',
		);
		lines.push('');
	}
	return lines.join('\n');
};

const main = async () => {
	const options = parseArgs(process.argv.slice(2));
	const connection = await createConnection();
	try {
		const hasCourseTest = await tableExists(connection, 'course_test');
		const tests = await fetchTests(connection, options);
		const testIds = tests.map((test) => test.id);
		const [questionRows, blueprintRows, attempts, links] =
			await Promise.all([
				fetchQuestions(connection, testIds),
				fetchBlueprints(connection, testIds),
				fetchAttempts(connection, testIds),
				fetchLinks(connection, testIds, hasCourseTest),
			]);

		const analyzed = buildAnalysis({
			tests,
			questionRows,
			blueprintRows,
			attempts,
			links,
		});
		const groups = groupDuplicates(analyzed, options.minQuestions);

		if (options.sql) {
			const sql = buildSql(groups);
			if (options.out) fs.writeFileSync(options.out, sql, 'utf8');
			else console.log(sql);
			return;
		}

		const output = options.json
			? JSON.stringify(
					{
						options,
						has_course_test: hasCourseTest,
						summary: {
							tests_analyzed: analyzed.length,
							duplicate_groups: groups.length,
							duplicate_tests: groups.reduce(
								(total, group) =>
									total + group.duplicates.length,
								0,
							),
							redundant_questions: groups.reduce(
								(total, group) =>
									total + group.redundant_questions,
								0,
							),
							redundant_answers: groups.reduce(
								(total, group) =>
									total + group.redundant_answers,
								0,
							),
						},
						groups,
					},
					null,
					2,
				)
			: buildMarkdown({
					options,
					tests: analyzed,
					groups,
					hasCourseTest,
				});

		if (options.out) {
			fs.writeFileSync(options.out, output, 'utf8');
			console.log(`Reporte guardado en ${options.out}`);
		} else {
			console.log(output);
		}
	} finally {
		await connection.end();
	}
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

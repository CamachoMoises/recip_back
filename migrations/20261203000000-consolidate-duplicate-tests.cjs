'use strict';

const crypto = require('node:crypto');

/**
 * Consolidación de exámenes duplicados (datos).
 *
 * El análisis `scripts/analyzeDuplicateTests.js` detectó un único grupo real de
 * exámenes idénticos en cursos de teoría:
 *
 *   - canónico: test 8  (E-0008, curso 9)
 *   - duplicados: test 10 (E-0010, curso 13) y test 11 (E-0011, curso 14)
 *
 * Ambos duplicados tienen 98 preguntas y 351 respuestas activas, con el mismo
 * contenido y blueprint que el test 8. La consolidación:
 *
 *   1. vincula el canónico (test 8) a los cursos que ya tenían los duplicados;
 *   2. deja los duplicados con `status = 0`.
 *
 * NUNCA borra preguntas, respuestas, vínculos ni intentos: los duplicados
 * quedan como historial y sus intentos siguen consultables.
 *
 * Seguridad:
 *   - Solo actúa si los tres exámenes existen, pertenecen a cursos de teoría
 *     (`course_type_id = 1`) y siguen teniendo la MISMA huella de contenido
 *     (preguntas + respuestas + blueprint). Si alguien editó uno, se omite con
 *     un warning en lugar de consolidar contenido distinto.
 *   - Es idempotente: re-ejecutarla no duplica vínculos ni cambia nada.
 *
 * Depende de `20261202000000-create-course-test.cjs` (tabla `course_test`).
 * NO se ejecuta automáticamente: correr `npm run migrate` manualmente y luego
 * volver a correr `npm run analyze:duplicates` (debe reportar 0 grupos).
 *
 * Nota: los cursos 13 y 14 están eliminados (`course.status = 0`). Tras la
 * consolidación, el test 8 sigue la regla general "editable solo si algún curso
 * vinculado está activo"; para volver a editarlo hay que reactivar alguno de
 * sus cursos. La consolidación no altera `course.status`.
 */
const CANONICAL_TEST_ID = 8;
const DUPLICATE_TEST_IDS = [10, 11];

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
		.map((row) => `${row.question_type_id}:${row.amount}:${row.value}`)
		.sort()
		.join('|');

const fetchFingerprint = async (sequelize, testId, transaction) => {
	const [questionRows] = await sequelize.query(
		`SELECT q.id, q.header, q.question_type_id, q.status AS question_status,
		        a.id AS answer_id, a.value, a.is_correct, a.status AS answer_status
		 FROM question q
		 LEFT JOIN answer a ON a.question_id = q.id
		 WHERE q.test_id = ?
		 ORDER BY q.id ASC, a.id ASC`,
		{ replacements: [testId], transaction },
	);

	const questions = new Map();
	for (const row of questionRows) {
		if (!questions.has(row.id)) {
			questions.set(row.id, {
				question_type_id: row.question_type_id,
				header: row.header,
				status: row.question_status,
				answers: [],
			});
		}
		if (row.answer_id !== null) {
			questions.get(row.id).answers.push({
				value: row.value,
				is_correct: Boolean(row.is_correct),
				status: row.answer_status,
			});
		}
	}

	const activeQuestions = [...questions.values()].filter(
		(question) => question.status !== 0,
	);

	const [blueprintRows] = await sequelize.query(
		`SELECT question_type_id, amount, value, status
		 FROM test_question_type
		 WHERE test_id = ?
		 ORDER BY question_type_id ASC`,
		{ replacements: [testId], transaction },
	);

	return sha256(
		JSON.stringify({
			questions: activeQuestions.map(questionFingerprint).sort(),
			blueprint: blueprintFingerprint(blueprintRows),
		}),
	);
};

module.exports = {
	async up(queryInterface) {
		const { sequelize } = queryInterface;

		await sequelize.transaction(async (transaction) => {
			const ids = [CANONICAL_TEST_ID, ...DUPLICATE_TEST_IDS];

			const [tests] = await sequelize.query(
				`SELECT t.id, t.code, t.course_id, t.status, c.course_type_id,
				        c.name AS course_name
				 FROM test t
				 INNER JOIN course c ON c.id = t.course_id
				 WHERE t.id IN (?)`,
				{ replacements: [ids], transaction },
			);

			if (tests.length !== ids.length) {
				console.warn(
					'[consolidate-duplicate-tests] Faltan exámenes del grupo; se omite la consolidación.',
				);
				return;
			}

			if (tests.some((test) => test.course_type_id !== 1)) {
				console.warn(
					'[consolidate-duplicate-tests] Algún examen no pertenece a un curso de teoría; se omite.',
				);
				return;
			}

			const fingerprints = await Promise.all(
				ids.map((id) => fetchFingerprint(sequelize, id, transaction)),
			);
			if (new Set(fingerprints).size !== 1) {
				console.warn(
					'[consolidate-duplicate-tests] El contenido de los exámenes ya no coincide; se omite la consolidación.',
				);
				return;
			}

			// Cursos que hoy ven los duplicados: sus vínculos existentes y, como
			// respaldo, el curso dueño de cada duplicado.
			const [linkRows] = await sequelize.query(
				`SELECT DISTINCT course_id
				 FROM course_test
				 WHERE test_id IN (?)`,
				{ replacements: [DUPLICATE_TEST_IDS], transaction },
			);

			const courseIds = new Set(linkRows.map((row) => row.course_id));
			for (const test of tests) {
				if (DUPLICATE_TEST_IDS.includes(test.id)) {
					courseIds.add(test.course_id);
				}
			}

			for (const courseId of courseIds) {
				await sequelize.query(
					`INSERT INTO course_test (course_id, test_id, created_at, updated_at)
					 VALUES (?, ?, NOW(), NOW())
					 ON DUPLICATE KEY UPDATE test_id = VALUES(test_id)`,
					{
						replacements: [courseId, CANONICAL_TEST_ID],
						transaction,
					},
				);
			}

			await sequelize.query(
				`UPDATE test
				 SET status = 0
				 WHERE id IN (?) AND status <> 0`,
				{ replacements: [DUPLICATE_TEST_IDS], transaction },
			);

			console.log(
				`[consolidate-duplicate-tests] Test ${CANONICAL_TEST_ID} vinculado a los cursos ${[
					...courseIds,
				].join(', ')}; tests ${DUPLICATE_TEST_IDS.join(', ')} desactivados.`,
			);
		});
	},

	async down() {
		// Revertir esta consolidación reactivaría los exámenes duplicados y
		// podría dejar dos exámenes activos por curso. Se deja como no-op
		// intencional: si hace falta revertir, revisar los vínculos y hacerlo
		// manualmente. No se borra contenido ni historial.
	},
};

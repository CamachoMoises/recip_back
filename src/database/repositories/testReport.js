import { Op, fn, col } from 'sequelize';
import { models } from '../index.js';
import {
	deriveAnswerResult,
	resolveStudentResponse,
} from '../../controller/utilities.js';

const {
	Answer,
	Course,
	CourseStudentTest,
	CourseStudentTestAnswer,
	CourseStudentTestQuestion,
	Question,
	QuestionType,
	Student,
	Test,
	TestQuestionType,
	User,
} = models;

const TEST_ATTRIBUTES = [
	'id',
	'course_id',
	'code',
	'duration',
	'min_score',
	'status',
];

const QUESTION_ATTRIBUTES = [
	'id',
	'header',
	'course_id',
	'question_type_id',
	'test_question_type_id',
	'test_id',
	'status',
];

const ANSWER_ATTRIBUTES = ['id', 'value', 'is_correct', 'status'];

const QUESTION_TYPE_ATTRIBUTES = [
	'id',
	'name',
	'max_answer',
	'value',
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const toPlain = (instance) =>
	instance ? instance.get({ plain: true }) : null;

/** Aplica el filtro de `status` (ausente = todos, true/false = exacto). */
const statusWhere = (where, status, column = 'status') => {
	if (typeof status === 'boolean') where[column] = status;
	return where;
};

const buildQuestionTypeIndex = (test) => {
	const plain = toPlain(test);
	const { test_question_types: rawTypes, ...testOnly } = plain;
	const types = [...(rawTypes ?? [])]
		.sort((a, b) => a.question_type_id - b.question_type_id)
		.map((tqt) => ({
			id: tqt.id,
			question_type_id: tqt.question_type_id,
			amount: tqt.amount,
			value: tqt.value,
			status: tqt.status,
			question_type: tqt.question_type ?? null,
		}));
	// El blueprint vive solo en `question_types`: se saca de `test` para no
	// devolverlo duplicado en la respuesta.
	return { test: testOnly, question_types: types };
};

/**
 * Test con su blueprint. Cada include declara `as:` explícito porque la
 * respuesta es contractual.
 */
const findTestWithBlueprint = async (test_id) => {
	const test = await Test.findByPk(test_id, {
		attributes: TEST_ATTRIBUTES,
		include: [
			{
				model: TestQuestionType,
				as: 'test_question_types',
				attributes: [
					'id',
					'amount',
					'value',
					'course_id',
					'question_type_id',
					'test_id',
					'status',
				],
				include: [
					{
						model: QuestionType,
						as: 'question_type',
						attributes: QUESTION_TYPE_ATTRIBUTES,
					},
				],
			},
		],
	});
	if (!test) return null;
	return buildQuestionTypeIndex(test);
};

/** Preguntas de un test con `question_type` y `answers` anidados. */
const findQuestionsByTest = async (test_id, { status, question_type_id }) => {
	const where = statusWhere({ test_id }, status);
	if (question_type_id) where.question_type_id = question_type_id;

	const questions = await Question.findAll({
		where,
		attributes: QUESTION_ATTRIBUTES,
		include: [
			{
				model: QuestionType,
				as: 'question_type',
				attributes: QUESTION_TYPE_ATTRIBUTES,
			},
			{
				model: Answer,
				as: 'answers',
				attributes: ANSWER_ATTRIBUTES,
			},
		],
		order: [
			['question_type_id', 'ASC'],
			['id', 'ASC'],
		],
	});

	return questions
		.map((q) => toPlain(q))
		.sort((a, b) => a.id - b.id)
		.map((q) => ({
			...q,
			// Orden estable y la correcta primero: el orden por defecto de MySQL
			// sobre hasMany no está garantizado.
			answers: [...(q.answers ?? [])].sort(
				(a, b) => b.is_correct - a.is_correct || a.id - b.id,
			),
		}));
};

const correctOf = (answers) => (answers ?? []).filter((a) => a.is_correct);

/** Payload anidado de una pregunta, compartido por todos los reportes. */
const shapeQuestion = (question, tqtById, { onlyCorrect = false } = {}) => {
	const answers = onlyCorrect
		? correctOf(question.answers)
		: (question.answers ?? []);
	const correct = correctOf(question.answers);

	return {
		id: question.id,
		header: question.header,
		test_id: question.test_id,
		question_type_id: question.question_type_id,
		question_type: question.question_type ?? null,
		test_question_type_id: question.test_question_type_id,
		points: tqtById.get(question.test_question_type_id) ?? null,
		status: question.status,
		answers: answers.map((a) => ({
			id: a.id,
			value: a.value,
			is_correct: a.is_correct,
			status: a.status,
		})),
		correct_answer_ids: correct.map((a) => a.id),
		correct_answers: correct.map((a) => ({ id: a.id, value: a.value })),
	};
};

const tqtIndex = (test_question_types) =>
	new Map(test_question_types.map((t) => [t.id, t.value]));

// -----------------------------------------------------------------------------
// 1) Listar exámenes
// -----------------------------------------------------------------------------

const getTestSummaries = async ({ status, course_id } = {}) => {
	const where = statusWhere({}, status);
	if (course_id) where.course_id = course_id;

	const tests = await Test.findAll({
		where,
		attributes: TEST_ATTRIBUTES,
		include: [
			{
				model: Course,
				as: 'course',
				attributes: ['id', 'name', 'code'],
			},
		],
		order: [['id', 'ASC']],
	});

	if (tests.length === 0) return [];

	const ids = tests.map((t) => t.id);

	const [questionCounts, attemptCounts] = await Promise.all([
		Question.findAll({
			attributes: [
				'test_id',
				[fn('COUNT', col('question.id')), 'question_count'],
			],
			where: { test_id: { [Op.in]: ids } },
			group: ['test_id'],
			raw: true,
		}),
		CourseStudentTest.findAll({
			attributes: [
				'test_id',
				[
					fn('COUNT', col('course_student_test.id')),
					'attempt_count',
				],
			],
			where: { test_id: { [Op.in]: ids } },
			group: ['test_id'],
			raw: true,
		}),
	]);

	const questionCountByTest = new Map(
		questionCounts.map((r) => [r.test_id, Number(r.question_count)]),
	);
	const attemptCountByTest = new Map(
		attemptCounts.map((r) => [r.test_id, Number(r.attempt_count)]),
	);

	return tests.map((test) => {
		const plain = toPlain(test);
		return {
			...plain,
			course: plain.course ?? null,
			question_count: questionCountByTest.get(plain.id) ?? 0,
			attempt_count: attemptCountByTest.get(plain.id) ?? 0,
		};
	});
};

// -----------------------------------------------------------------------------
// 2) Hoja de preguntas con la respuesta correcta marcada
// -----------------------------------------------------------------------------

const getTestQuestionSheet = async (test_id, filters = {}) => {
	const blueprint = await findTestWithBlueprint(test_id);
	if (!blueprint) return null;

	const questions = await findQuestionsByTest(test_id, filters);
	const points = tqtIndex(blueprint.question_types);

	return {
		test: blueprint.test,
		question_types: blueprint.question_types,
		total_questions: questions.length,
		questions: questions.map((q) => shapeQuestion(q, points)),
	};
};

// -----------------------------------------------------------------------------
// 3) Solo respuestas correctas
// -----------------------------------------------------------------------------

const getTestCorrectAnswers = async (test_id, filters = {}) => {
	const blueprint = await findTestWithBlueprint(test_id);
	if (!blueprint) return null;

	const questions = (await findQuestionsByTest(test_id, filters)).filter((q) =>
		correctOf(q.answers).length > 0,
	);
	const points = tqtIndex(blueprint.question_types);

	return {
		test: blueprint.test,
		question_types: blueprint.question_types,
		total_questions: questions.length,
		questions: questions.map((q) =>
			shapeQuestion(q, points, { onlyCorrect: true }),
		),
	};
};

// -----------------------------------------------------------------------------
// 4-6) Reportes por intento de alumno
// -----------------------------------------------------------------------------

/**
 * Carga el intento validando que pertenezca al `test_id` solicitado. Devuelve
 * `null` si no existe o si los ids no coinciden.
 */
const findAttemptForTest = async (test_id, cst_id) => {
	const attempt = await CourseStudentTest.findByPk(cst_id, {
		attributes: [
			'id',
			'course_id',
			'test_id',
			'student_id',
			'course_student_id',
			'code',
			'attempts',
			'date',
			'score',
			'approve',
			'status',
			'finished',
		],
		include: [
			{
				model: Student,
				as: 'student',
				attributes: ['id', 'user_id', 'status'],
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name', 'last_name', 'email'],
					},
				],
			},
			{ model: Test, as: 'test', attributes: TEST_ATTRIBUTES },
		],
	});

	if (!attempt) return null;
	if (Number(toPlain(attempt).test_id) !== Number(test_id)) return null;
	return toPlain(attempt);
};

/** Preguntas sorteadas del intento, con la respuesta del alumno. */
const findAttemptQuestions = async (cst_id, { status, question_type_id }) => {
	// `status` gobierna la entidad principal (la pregunta), igual que en los
	// reportes por test, así que el filtro va en el include de Question.
	const questionInclude = {
		model: Question,
		as: 'question',
		attributes: QUESTION_ATTRIBUTES,
		required: true,
		where: {},
		include: [
			{
				model: QuestionType,
				as: 'question_type',
				attributes: QUESTION_TYPE_ATTRIBUTES,
			},
			{
				model: Answer,
				as: 'answers',
				attributes: ANSWER_ATTRIBUTES,
			},
		],
	};
	if (typeof status === 'boolean') questionInclude.where.status = status;
	if (question_type_id) questionInclude.where.question_type_id = question_type_id;

	const rows = await CourseStudentTestQuestion.findAll({
		where: { course_student_test_id: cst_id },
		attributes: [
			'id',
			'question_id',
			'test_id',
			'course_id',
			'course_student_id',
			'course_student_test_id',
			'Answered',
		],
		include: [
			questionInclude,
			{
				model: CourseStudentTestAnswer,
				as: 'course_student_test_answer',
				attributes: ['id', 'question_id', 'resp', 'score', 'status'],
			},
		],
		order: [['question_id', 'ASC']],
	});

	return rows
		.map(toPlain)
		.filter((row) => Boolean(row.question))
		.map((row) => {
			row.question.answers = [...(row.question.answers ?? [])].sort(
				(a, b) => b.is_correct - a.is_correct || a.id - b.id,
			);
			return row;
		});
};

/** Envuelve las preguntas del intento en el payload base común. */
const buildAttemptPayload = async (test_id, cst_id, filters) => {
	const attempt = await findAttemptForTest(test_id, cst_id);
	if (!attempt) return null;

	const rows = await findAttemptQuestions(cst_id, filters);
	const tqtIds = [...new Set(rows.map((r) => r.question.test_question_type_id))];

	// `test_question_type.value` es la fuente de los puntos por pregunta.
	const tqts = tqtIds.length
		? await TestQuestionType.findAll({
				where: { id: { [Op.in]: tqtIds } },
				attributes: [
					'id',
					'value',
					'amount',
					'question_type_id',
				],
				raw: true,
			})
		: [];
	const points = tqtIndex(tqts);

	return { attempt, rows, points };
};

const shapeAttemptQuestion = (row, points) => {
	const question = row.question;
	const answer = row.course_student_test_answer ?? null;
	const pointsPossible = points.get(question.test_question_type_id) ?? null;
	const correct = correctOf(question.answers);

	return {
		course_student_test_question_id: row.id,
		answered: row.Answered,
		id: question.id,
		header: question.header,
		test_id: question.test_id,
		question_type_id: question.question_type_id,
		question_type: question.question_type ?? null,
		test_question_type_id: question.test_question_type_id,
		points: pointsPossible,
		status: question.status,
		answers: question.answers.map((a) => ({
			id: a.id,
			value: a.value,
			is_correct: a.is_correct,
			status: a.status,
		})),
		correct_answer_ids: correct.map((a) => a.id),
		correct_answers: correct.map((a) => ({ id: a.id, value: a.value })),
		course_student_test_answer: answer
			? {
					id: answer.id,
					question_id: answer.question_id,
					resp: answer.resp,
					score: answer.score,
					status: answer.status,
				}
			: null,
	};
};

/** 4) Intento con respuesta cruda del alumno + respuesta correcta. */
const getTestAttemptDetail = async (test_id, cst_id, filters = {}) => {
	const payload = await buildAttemptPayload(test_id, cst_id, filters);
	if (!payload) return null;

	return {
		...payload.attempt,
		total_questions: payload.rows.length,
		questions: payload.rows.map((row) =>
			shapeAttemptQuestion(row, payload.points),
		),
	};
};

/** 5) Respuestas deserializadas del alumno, con veredicto y puntaje. */
const getTestAttemptAnswers = async (test_id, cst_id, filters = {}) => {
	const payload = await buildAttemptPayload(test_id, cst_id, filters);
	if (!payload) return null;

	const questions = payload.rows.map((row) => {
		const question = row.question;
		const answer = row.course_student_test_answer ?? null;
		const pointsPossible = payload.points.get(
			question.test_question_type_id,
		);
		const correct = correctOf(question.answers);
		const correctIds = correct.map((a) => a.id);
		const resolved = resolveStudentResponse({
			questionTypeId: question.question_type_id,
			resp: answer ? answer.resp : null,
			answers: question.answers,
		});

		return {
			course_student_test_question_id: row.id,
			answered: row.Answered,
			id: question.id,
			header: question.header,
			question_type_id: question.question_type_id,
			question_type: question.question_type ?? null,
			status: question.status,
			answers: question.answers.map((a) => ({
				id: a.id,
				value: a.value,
				is_correct: a.is_correct,
				status: a.status,
			})),
			correct_answer_ids: correctIds,
			correct_answers: correct.map((a) => ({ id: a.id, value: a.value })),
			student_selected_ids: resolved.selectedIds,
			student_response: resolved.responseText,
			student_response_raw: answer ? answer.resp : null,
			correct_answers_text: resolved.correctText,
			result: deriveAnswerResult({
				questionTypeId: question.question_type_id,
				resp: answer ? answer.resp : null,
				correctIds,
				score: answer ? answer.score : null,
				pointsPossible,
			}),
			points_possible: pointsPossible,
			points_scored: answer ? answer.score : null,
		};
	});

	return {
		...payload.attempt,
		total_questions: questions.length,
		questions,
	};
};

/** 6) Solo las preguntas que le tocaron al alumno en ese intento. */
const getTestAttemptQuestions = async (test_id, cst_id, filters = {}) => {
	const payload = await buildAttemptPayload(test_id, cst_id, filters);
	if (!payload) return null;

	return {
		...payload.attempt,
		total_questions: payload.rows.length,
		questions: payload.rows.map((row) =>
			shapeAttemptQuestion(row, payload.points),
		),
	};
};

// -----------------------------------------------------------------------------
// 7) Resultado global por alumno
// -----------------------------------------------------------------------------

/**
 * `pageSize = -1` devuelve todos los intentos. La agregación va en consultas
 * aparte: hacer SUM() a través de hasMany dentro del findAndCountAll infla
 * `totalItems` por el producto cartesiano de las filas hijas.
 */
const getTestResults = async (test_id, filters = {}) => {
	const { student_id, finished, pageSize, currentPage } = filters;

	const where = { test_id };
	if (student_id) where.student_id = student_id;
	if (typeof finished === 'boolean') where.finished = finished;

	const unlimited = Number(pageSize) === -1;
	const size = unlimited ? null : Number(pageSize) || 10;
	const page = Number(currentPage) || 1;
	const offset = unlimited ? 0 : (page - 1) * size;

	const paged = await CourseStudentTest.findAndCountAll({
		distinct: true,
		col: 'id',
		where,
		attributes: [
			'id',
			'test_id',
			'student_id',
			'course_student_id',
			'code',
			'attempts',
			'date',
			'score',
			'approve',
			'status',
			'finished',
		],
		include: [
			{
				model: Student,
				as: 'student',
				attributes: ['id', 'user_id', 'status'],
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name', 'last_name', 'email'],
					},
				],
			},
			{ model: Test, as: 'test', attributes: TEST_ATTRIBUTES },
		],
		order: [['score', 'DESC'], ['id', 'DESC']],
		...(unlimited ? {} : { limit: size, offset }),
	});

	const rows = paged.rows.map(toPlain);
	const ids = rows.map((r) => r.id);

	let scoreByAttempt = new Map();
	let possibleByAttempt = new Map();

	if (ids.length > 0) {
		// `total_possible` se suma en JS con los blueprints del test en vez de
		// con un SUM() sobre el JOIN:CourseStudentTestQuestion -> Question ->
		// TestQuestionType, que depende del alias de tabla que genera Sequelize
		// y es frágil. Son 4 consultas fijas, independientes del tamaño de página.
		const [scored, tqtRows, questionRows, drawnRows] = await Promise.all([
			CourseStudentTestAnswer.findAll({
				attributes: [
					'course_student_test_id',
					[fn('SUM', col('score')), 'score_computed'],
				],
				where: { course_student_test_id: { [Op.in]: ids } },
				group: ['course_student_test_id'],
				raw: true,
			}),
			TestQuestionType.findAll({
				attributes: ['id', 'value'],
				where: { test_id },
				raw: true,
			}),
			Question.findAll({
				attributes: ['id', 'test_question_type_id'],
				where: { test_id },
				raw: true,
			}),
			CourseStudentTestQuestion.findAll({
				attributes: ['course_student_test_id', 'question_id'],
				where: { course_student_test_id: { [Op.in]: ids } },
				raw: true,
			}),
		]);

		scoreByAttempt = new Map(
			scored.map((r) => [
				r.course_student_test_id,
				Number(r.score_computed ?? 0),
			]),
		);

		const tqtValue = new Map(
			tqtRows.map((r) => [r.id, Number(r.value) || 0]),
		);
		const questionTqt = new Map(
			questionRows.map((r) => [r.id, r.test_question_type_id]),
		);
		const totals = new Map();
		for (const drawn of drawnRows) {
			const tqtId = questionTqt.get(drawn.question_id);
			if (tqtId === undefined) continue;
			const current = totals.get(drawn.course_student_test_id) ?? 0;
			totals.set(
				drawn.course_student_test_id,
				current + (tqtValue.get(tqtId) ?? 0),
			);
		}
		possibleByAttempt = totals;
	}

	const data = rows.map((row) => ({
		attempt_id: row.id,
		attempt_code: row.code,
		test_id: row.test_id,
		attempts: row.attempts,
		date: row.date,
		finished: row.finished,
		approve: row.approve,
		status: row.status,
		student: row.student ?? null,
		course_student_id: row.course_student_id,
		// Puntaje congelado al finalizar el intento (course_student_test.score).
		score: row.score,
		// Suma en vivo de los scores por pregunta; puede divergir de `score` si
		// se editaron respuestas después de cerrar el intento.
		score_computed: scoreByAttempt.get(row.id) ?? 0,
		// Suma de test_question_type.value de lo sorteado; puede quedar
		// desactualizada si cambió el valor de un tipo de pregunta después.
		total_possible: possibleByAttempt.get(row.id) ?? 0,
		min_score: row.test ? row.test.min_score : null,
	}));

	const totalItems = paged.count;

	return {
		data,
		totalItems,
		currentPage: unlimited ? 1 : page,
		pageSize: unlimited ? -1 : size,
		totalPages:
			totalItems === 0 ? 0 : unlimited ? 1 : Math.ceil(totalItems / size),
	};
};

export {
	getTestAttemptAnswers,
	getTestAttemptDetail,
	getTestAttemptQuestions,
	getTestCorrectAnswers,
	getTestQuestionSheet,
	getTestResults,
	getTestSummaries,
};

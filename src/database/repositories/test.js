import moment from 'moment';
import { models, sequelize } from '../index.js';
import { getCourseStudentById } from './course.js';
import { Op, Sequelize } from 'sequelize';
import { getCourseStudentIdsByInstructor } from './instructor.js';

const {
	Test,
	QuestionType,
	TestQuestionType,
	Question,
	Answer,
	Course,
	CourseTest,
	CourseStudent,
	CourseStudentTest,
	CourseStudentTestQuestion,
	CourseStudentTestAnswer,
} = models;

const COURSE_SUMMARY_ATTRIBUTES = ['id', 'name', 'code', 'color'];

/** Error con código HTTP para que el controller responda el status correcto. */
const httpError = (status, message, extra = {}) => {
	const error = new Error(message);
	error.status = status;
	Object.assign(error, extra);
	return error;
};

/** Valida que un curso pueda alojar/vincular exámenes (activo y de teoría). */
const assertCourseCanHostTest = async (course_id, { transaction } = {}) => {
	const course = await Course.findByPk(course_id, { transaction });
	if (!course) {
		throw httpError(404, 'Course not found');
	}
	if (!course.status) {
		throw httpError(409, 'El curso está eliminado');
	}
	if (course.course_type_id !== 1) {
		throw httpError(
			409,
			'Solo los cursos de teoría (course_type_id = 1) pueden compartir exámenes',
		);
	}
	return course;
};

/** Aplana un Test con `course` (dueño) y `courses` (vinculados). */
const shapeTestWithCourses = (test) => {
	const plain = test.get({ plain: true });
	const courses = plain.courses ?? [];
	return {
		...plain,
		course: plain.course ?? null,
		courses,
		is_shared: courses.length > 1,
	};
};

const getAllTest = async () => await Test.findAll();
const getTestById = async (id) => {
	const test = await Test.findOne({
		where: id,
		include: [
			{
				model: TestQuestionType,
				include: [QuestionType],
			},
			{
				model: Course,
				as: 'course',
				attributes: COURSE_SUMMARY_ATTRIBUTES,
			},
			{
				model: Course,
				as: 'courses',
				attributes: COURSE_SUMMARY_ATTRIBUTES,
				through: { attributes: [] },
			},
		],
	});
	if (!test) {
		throw new Error('Test not found');
	}
	return shapeTestWithCourses(test);
};
const getAllTestCourse = async (filters) => {
	const include = [
		{
			model: TestQuestionType,
			include: [QuestionType],
		},
		{
			model: Course,
			as: 'course',
			attributes: COURSE_SUMMARY_ATTRIBUTES,
		},
		{
			model: Course,
			as: 'courses',
			attributes: COURSE_SUMMARY_ATTRIBUTES,
			through: { attributes: [] },
		},
	];

	// La visibilidad del examen se resuelve por la tabla puente: un test
	// aparece en el curso si está vinculado, sin importar cuál es el dueño.
	if (filters.course_id) {
		include.push({
			model: CourseTest,
			as: 'course_tests',
			attributes: [],
			required: true,
			where: { course_id: filters.course_id },
		});
	}

	const data = await Test.findAll({
		include,
		order: [['id', 'ASC']],
	});
	return data.map(shapeTestWithCourses);
};
// ---------------------------------------------------------------------------
// Vínculos examen ↔ curso (`course_test`)
// ---------------------------------------------------------------------------

const getTestIdsByCourse = async (course_id) => {
	const links = await CourseTest.findAll({
		where: { course_id },
		attributes: ['test_id'],
		order: [['test_id', 'ASC']],
	});
	return links.map((link) => link.test_id);
};

const isTestLinkedToCourse = async (course_id, test_id) => {
	const link = await CourseTest.findOne({
		where: { course_id, test_id },
		attributes: ['id'],
	});
	return Boolean(link);
};

const countCoursesByTest = async (test_id) =>
	CourseTest.count({ where: { test_id } });

const countActiveCoursesByTest = async (test_id) =>
	Course.count({
		where: { status: true },
		include: [
			{
				model: CourseTest,
				attributes: [],
				required: true,
				where: { test_id },
			},
		],
	});

const getActiveTestsByCourse = async (course_id, { transaction } = {}) =>
	Test.findAll({
		where: { status: true },
		attributes: ['id'],
		include: [
			{
				model: CourseTest,
				as: 'course_tests',
				attributes: [],
				required: true,
				where: { course_id },
			},
		],
		order: [['id', 'ASC']],
		transaction,
	});

/**
 * Examen activo de un curso, resuelto por `course_test` (no por `test.course_id`).
 * Si hubiera más de uno por datos viejos, usa el de menor id y deja un warning.
 */
const getActiveTestByCourse = async (course_id) => {
	const tests = await getActiveTestsByCourse(course_id);
	if (tests.length > 1) {
		console.warn(
			`[test] El curso ${course_id} tiene ${tests.length} exámenes activos; se usará el de menor id`,
		);
	}
	return tests[0] ?? null;
};

const getCoursesByTest = async (test_id) => {
	const test = await Test.findByPk(test_id);
	if (!test) {
		throw httpError(404, 'Test not found');
	}
	const courses = await Course.findAll({
		attributes: [...COURSE_SUMMARY_ATTRIBUTES, 'status', 'course_type_id'],
		include: [
			{
				model: CourseTest,
				attributes: [],
				required: true,
				where: { test_id },
			},
		],
		order: [['id', 'ASC']],
	});
	return {
		test_id: test.id,
		owner_course_id: test.course_id,
		courses: courses.map((course) => ({
			...course.get({ plain: true }),
			is_owner: course.id === test.course_id,
		})),
	};
};

const linkTestToCourse = async ({ course_id, test_id, transaction }) => {
	await assertCourseCanHostTest(course_id, { transaction });

	const test = await Test.findByPk(test_id, { transaction });
	if (!test) {
		throw httpError(404, 'Test not found');
	}

	const owner = await Course.findByPk(test.course_id, { transaction });
	if (!owner || owner.course_type_id !== 1) {
		throw httpError(
			409,
			'El examen pertenece a un curso que no es de teoría',
		);
	}

	const existing = await CourseTest.findOne({
		where: { course_id, test_id },
		transaction,
	});
	if (existing) {
		return { link: existing, created: false };
	}

	if (test.status) {
		const activeTests = await getActiveTestsByCourse(course_id, {
			transaction,
		});
		const conflict = activeTests.find((active) => active.id !== test.id);
		if (conflict) {
			throw httpError(409, 'El curso ya tiene otro examen activo', {
				conflicts: [{ course_id, test_id: conflict.id }],
			});
		}
	}

	const link = await CourseTest.create(
		{ course_id, test_id },
		{ transaction },
	);
	return { link, created: true };
};

/** Vincula varios exámenes en una sola transacción (todo o nada). */
const linkTestsToCourse = async (course_id, test_ids) =>
	sequelize.transaction(async (transaction) => {
		const linked = [];
		const skipped = [];
		const uniqueTestIds = [...new Set(test_ids.map(Number))];

		for (const test_id of uniqueTestIds) {
			const result = await linkTestToCourse({
				course_id,
				test_id,
				transaction,
			});
			if (result.created) {
				linked.push(test_id);
			} else {
				skipped.push(test_id);
			}
		}

		return { linked, skipped };
	});

/** Desvincula sin borrar el examen, sus preguntas, respuestas ni intentos. */
const unlinkTestFromCourse = async (course_id, test_id) => {
	const test = await Test.findByPk(test_id);
	if (!test) {
		throw httpError(404, 'Test not found');
	}
	const removed = await CourseTest.destroy({
		where: { course_id, test_id },
	});
	return removed > 0;
};

/** Editar el examen exige al menos un curso vinculado activo (no eliminado). */
const assertAnyLinkedCourseActive = async (test_id) => {
	const test = await Test.findByPk(test_id);
	if (!test) {
		throw httpError(404, 'Test not found');
	}
	const total = await countCoursesByTest(test_id);
	if (total === 0) {
		return test;
	}
	const active = await countActiveCoursesByTest(test_id);
	if (active === 0) {
		throw httpError(
			409,
			'No se puede editar el examen: todos los cursos vinculados están eliminados',
		);
	}
	return test;
};

/** Conflictos al activar un examen: cursos vinculados con otro examen activo. */
const getTestActivationConflicts = async (test_id) => {
	const links = await CourseTest.findAll({
		where: { test_id },
		attributes: ['course_id'],
	});
	const courseIds = links.map((link) => link.course_id);
	if (courseIds.length === 0) {
		return [];
	}

	const conflicts = await Test.findAll({
		where: { status: true, id: { [Op.ne]: test_id } },
		attributes: ['id'],
		include: [
			{
				model: CourseTest,
				as: 'course_tests',
				attributes: ['course_id'],
				required: true,
				where: { course_id: courseIds },
			},
		],
	});

	const seen = new Set();
	const result = [];
	for (const conflict of conflicts) {
		for (const link of conflict.course_tests ?? []) {
			const key = `${link.course_id}:${conflict.id}`;
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);
			result.push({
				course_id: link.course_id,
				test_id: conflict.id,
			});
		}
	}
	return result;
};

const getCourseStudentTestById = async (id) => {
	const data = await CourseStudentTest.findOne({
		where: { id: id },
		include: [
			{
				model: CourseStudentTestQuestion,
				include: [
					{
						model: Question,
						include: [QuestionType, Answer],
					},
					{
						model: CourseStudentTestAnswer,
					},
				],
			},
		],
	});
	return data;
};
const getQuestionById = async ({ id }) => {
	const question = await Question.findOne({
		where: { id: id },
		include: [
			{
				model: Answer,
			},
			{
				model: QuestionType,
			},
		],
	});

	return question;
};
const getQuestionTest = async (filters) => {
	const whereClause = {};
	if (filters.test_id) {
		whereClause.test_id = filters.test_id;
	}
	if (filters.question_type_id > 0) {
		whereClause.question_type_id = filters.question_type_id;
	}
	if (filters.test_question_type_id > 0) {
		whereClause.test_question_type_id = filters.test_question_type_id;
	}
	// Las preguntas pertenecen al examen (`test_id`); `course_id` ya no se
	// usa como filtro porque el examen puede estar compartido por varios cursos.
	const data = await Question.findAll({
		where: whereClause,
		// order: [['created_at', 'DESC']],
		include: [
			{
				model: Answer,
			},
			{
				model: QuestionType,
			},
		],
	});
	return data;
};

const getQuestionTypes = async () => {
	const data = await QuestionType.findAll();
	return data;
};

const createTestQuestionType = async ({
	amount,
	value,
	question_type_id,
	status,
	test_id,
}) => {
	const test = await Test.findByPk(test_id);
	if (!test) {
		throw new Error('Test not found');
	}
	const newTestQuestionType = await TestQuestionType.create({
		// La autoría del blueprint pertenece siempre al curso dueño del examen.
		course_id: test.course_id,
		amount,
		value,
		question_type_id,
		status,
		test_id,
	});
	return newTestQuestionType;
};
const updateQuestionType = async ({ id, value }) => {
	const questionType = await QuestionType.findByPk(id);
	if (!questionType) {
		throw new Error('Question Type not found');
	}
	await questionType.update({ value });
	return questionType;
};
const createTest = async ({
	course_id,
	duration,
	min_score,
	course_ids = [],
}) =>
	sequelize.transaction(async (transaction) => {
		// El dueño del examen debe ser un curso de teoría activo.
		const owner = await assertCourseCanHostTest(course_id, { transaction });

		const extraCourseIds = [...new Set(course_ids.map(Number))];
		if (extraCourseIds.length > 0) {
			// Cursos adicionales a los que se compartirá el examen.
			for (const extraCourseId of extraCourseIds) {
				await assertCourseCanHostTest(extraCourseId, { transaction });
			}
		}

		let numberCode = 1;
		const prevTest = await Test.findOne({
			order: [['id', 'DESC']],
			transaction,
		});
		if (prevTest) {
			numberCode = prevTest.id + 1;
		}
		const stringCode = String(numberCode).padStart(4, '0');
		const code = `E-${stringCode}`;
		const test = await Test.create(
			{
				course_id,
				code,
				duration,
				min_score,
				status: false,
			},
			{ transaction },
		);

		// El curso dueño siempre queda vinculado para que el examen sea visible.
		const links = [owner.id, ...extraCourseIds]
			.filter((id, index, list) => list.indexOf(id) === index)
			.map((linkedCourseId) => ({
				course_id: linkedCourseId,
				test_id: test.id,
			}));
		await CourseTest.bulkCreate(links, {
			transaction,
			ignoreDuplicates: true,
		});

		return test;
	});
const TEST_CODE_MAX_LENGTH = 50;

/**
 * Genera un `test.code` único a nivel de aplicación. La columna no tiene
 * índice UNIQUE, así que se resuelve con sufijos `-2`, `-3`, ... respetando
 * el largo máximo de `STRING(50)`.
 */
const buildUniqueTestCode = async (base, transaction) => {
	const trimmed = String(base ?? '').trim() || 'COPIA';
	let candidate = trimmed.slice(0, TEST_CODE_MAX_LENGTH);
	let suffix = 2;

	while (
		await Test.count({ where: { code: candidate }, transaction })
	) {
		const suffixStr = `-${suffix}`;
		candidate = `${trimmed.slice(
			0,
			TEST_CODE_MAX_LENGTH - suffixStr.length,
		)}${suffixStr}`;
		suffix += 1;
	}

	return candidate;
};

/**
 * Clona un examen completo (blueprint + preguntas + respuestas) en otro curso.
 * El clon siempre nace inactivo y solo se vincula al curso destino. No copia
 * intentos ni los vínculos `course_test` del origen.
 */
const cloneTest = async ({
	test_id,
	course_id,
	code,
	duration,
	min_score,
	transaction,
}) => {
	const run = async (tx) => {
		const source = await Test.findByPk(test_id, { transaction: tx });
		if (!source) {
			throw httpError(404, 'Test not found');
		}

		const target = await assertCourseCanHostTest(course_id, {
			transaction: tx,
		});
		if (source.course_id === target.id) {
			throw httpError(
				409,
				'El curso destino debe ser diferente al curso dueño del examen',
			);
		}

		// El curso dueño del origen puede estar eliminado: clonar es una vía
		// válida para rescatar contenido. Lo que sí se exige es que sea teórico.
		const owner = await Course.findByPk(source.course_id, {
			transaction: tx,
		});
		if (!owner || owner.course_type_id !== 1) {
			throw httpError(
				409,
				'El examen origen no pertenece a un curso de teoría',
			);
		}

		const [sourceTqts, sourceQuestions, sourceAnswers] = await Promise.all([
			TestQuestionType.findAll({
				where: { test_id },
				order: [['id', 'ASC']],
				transaction: tx,
			}),
			Question.findAll({
				where: { test_id },
				order: [['id', 'ASC']],
				transaction: tx,
			}),
			Answer.findAll({
				where: { test_id },
				order: [['id', 'ASC']],
				transaction: tx,
			}),
		]);

		// Guard de integridad: no se crea un clon a medias desde datos roscos.
		const tqtIds = new Set(sourceTqts.map((row) => row.id));
		const questionIds = new Set(sourceQuestions.map((row) => row.id));
		const inconsistent =
			sourceQuestions.some(
				(question) => !tqtIds.has(question.test_question_type_id),
			) ||
			sourceAnswers.some(
				(answer) => !questionIds.has(answer.question_id),
			);
		if (inconsistent) {
			throw httpError(
				409,
				'El examen origen tiene preguntas o respuestas inconsistentes',
			);
		}

		// `code` vacío/null/undefined => se genera automáticamente.
		const requestedCode =
			typeof code === 'string' ? code.trim() : code;
		let newCode;
		if (requestedCode) {
			const taken = await Test.count({
				where: { code: requestedCode },
				transaction: tx,
			});
			if (taken > 0) {
				throw httpError(409, 'Ya existe un examen con ese código');
			}
			newCode = requestedCode;
		} else {
			// Clonar un clon no debe producir `-COPIA-COPIA`: se toma la raíz
			// del código y el helper resuelve el sufijo numérico.
			const rootCode = source.code.replace(/-COPIA(-\d+)?$/i, '');
			newCode = await buildUniqueTestCode(`${rootCode}-COPIA`, tx);
		}

		const cloned = await Test.create(
			{
				course_id: target.id,
				code: newCode,
				duration: duration ?? source.duration,
				min_score: min_score ?? source.min_score,
				// Regla dura: el clon siempre nace inactivo.
				status: false,
			},
			{ transaction: tx },
		);

		// Blueprint: se remapean los IDs para que las preguntas copiadas
		// apunten a las filas nuevas.
		const tqtMap = new Map();
		for (const tqt of sourceTqts) {
			const created = await TestQuestionType.create(
				{
					course_id: target.id,
					test_id: cloned.id,
					question_type_id: tqt.question_type_id,
					amount: tqt.amount,
					value: tqt.value,
					status: tqt.status,
				},
				{ transaction: tx },
			);
			tqtMap.set(tqt.id, created.id);
		}

		const questionMap = new Map();
		for (const question of sourceQuestions) {
			const created = await Question.create(
				{
					course_id: target.id,
					test_id: cloned.id,
					question_type_id: question.question_type_id,
					test_question_type_id: tqtMap.get(
						question.test_question_type_id,
					),
					header: question.header,
					status: question.status,
				},
				{ transaction: tx },
			);
			questionMap.set(question.id, created.id);
		}

		if (sourceAnswers.length > 0) {
			await Answer.bulkCreate(
				sourceAnswers.map((answer) => ({
					course_id: target.id,
					test_id: cloned.id,
					question_id: questionMap.get(answer.question_id),
					value: answer.value,
					is_correct: answer.is_correct,
					status: answer.status,
				})),
				{ transaction: tx },
			);
		}

		await linkTestToCourse({
			course_id: target.id,
			test_id: cloned.id,
			transaction: tx,
		});

		return {
			test: cloned,
			source_test_id: source.id,
			counts: {
				test_question_types: sourceTqts.length,
				questions: sourceQuestions.length,
				answers: sourceAnswers.length,
			},
		};
	};

	if (transaction) {
		return run(transaction);
	}
	return sequelize.transaction(run);
};

const updateTest = async ({ id, duration, min_score, status }) => {
	const test = await Test.findByPk(id);
	if (!test) {
		throw new Error('Test not found');
	}
	await test.update({ duration, min_score, status });
	return test;
};

const createQuestionTest = async ({
	test_id,
	question_type_id,
	test_question_type_id,
	header,
}) => {
	const test = await Test.findByPk(test_id);
	if (!test) {
		throw new Error('Test not found');
	}
	const question = await Question.create({
		// `question.course_id` es denormalizado y siempre apunta al curso dueño
		// del examen, sin importar desde qué curso vinculado se cree.
		course_id: test.course_id,
		test_id,
		question_type_id,
		test_question_type_id,
		header,
		value: 1,
		status: true,
	});
	return question;
};
const updateQuestionTest = async ({ id, header, status }) => {
	const question = await Question.findByPk(id);
	if (!question) {
		throw new Error('Question not found');
	}
	await question.update({ header, status });
	return question;
};

const deleteQuestionById = async (id) =>
	sequelize.transaction(async (transaction) => {
		const question = await Question.findByPk(id, { transaction });
		if (!question) {
			throw new Error('Question not found');
		}

		const attempts = await CourseStudentTestQuestion.count({
			where: { question_id: id },
			transaction,
		});
		if (attempts > 0) {
			throw new Error('Question has attempts');
		}

		const deletedAnswers = await Answer.destroy({
			where: { question_id: id },
			transaction,
		});
		await question.destroy({ transaction });

		return {
			deleted_count: 1,
			deleted_answers_count: deletedAnswers,
		};
	});

const deleteQuestionsByTestId = async (test_id) =>
	sequelize.transaction(async (transaction) => {
		const test = await Test.findByPk(test_id, { transaction });
		if (!test) {
			throw new Error('Test not found');
		}

		const questions = await Question.findAll({
			attributes: ['id'],
			where: { test_id },
			transaction,
		});
		const questionIds = questions.map((question) => question.id);
		if (questionIds.length === 0) {
			return { deleted_count: 0, deleted_answers_count: 0 };
		}

		const attempts = await CourseStudentTestQuestion.count({
			where: { question_id: { [Op.in]: questionIds } },
			transaction,
		});
		if (attempts > 0) {
			throw new Error('Questions have attempts');
		}

		const deletedAnswers = await Answer.destroy({
			where: { question_id: { [Op.in]: questionIds } },
			transaction,
		});
		const deletedQuestions = await Question.destroy({
			where: { id: { [Op.in]: questionIds } },
			transaction,
		});

		return {
			deleted_count: deletedQuestions,
			deleted_answers_count: deletedAnswers,
		};
	});

const createAnswerQuestionTest = async ({
	test_id,
	question_id,
	value,
	is_correct = false,
}) => {
	const test = await Test.findByPk(test_id);
	if (!test) {
		throw new Error('Test not found');
	}
	const question = await Question.findByPk(question_id);
	if (!question) {
		throw new Error('Question not found');
	}
	const answer = await Answer.create({
		// Igual que `question`, la respuesta hereda el curso dueño del examen.
		course_id: test.course_id,
		test_id,
		question_id,
		value,
		is_correct,
		status: true,
	});
	return answer;
};

const updateAnswerQuestionTest = async ({
	id,
	value,
	is_correct,
	status,
}) => {
	const answer = await Answer.findByPk(id);
	if (!answer) {
		throw new Error('Answer not found');
	}
	await answer.update({ value, is_correct, status });
	return answer;
};

const updateTestQuestionType = async ({
	id,
	amount,
	value,
	status,
}) => {
	const testQuestionType = await TestQuestionType.findByPk(id);
	if (!testQuestionType) {
		throw new Error('Test question Type not found');
	}
	await testQuestionType.update({ amount, value, status });
	return testQuestionType;
};
const getAnswerQuestion = async (id) => {
	const data = await Answer.findAll({
		where: {
			question_id: id,
		},
	});
	return data;
};
const getCourseStudentTest = async (filters) => {
	const whereClause = {};
	if (filters.course_type_id) {
		whereClause.course_type_id = filters.course_type_id;
	}
	if (typeof filters.finished != 'undefined') {
		whereClause.finished = filters.finished;
	}
	if (filters.test_id) {
		whereClause.test_id = filters.test_id;
	}
	if (filters.date) {
		//TIMEZONE TO DO
		whereClause.date = { [Op.lte]: `${filters.date} 19:59:59` };
	}
	const data = await CourseStudentTest.findAll({
		where: whereClause,
		include: [{ model: Test }],
	});

	return data;
};

const createCourseStudentTest = async (
	course_student_id,
	test_id,
) => {
	let numberCode = 1;
	const prevCourseStudentTest = await CourseStudentTest.findOne({
		where: {
			course_student_id: course_student_id,
			test_id: test_id,
		},
		order: [['createdAt', 'DESC']],
	});
	const CS = await getCourseStudentById(course_student_id);
	if (prevCourseStudentTest) {
		numberCode = prevCourseStudentTest.id + 1;
	}
	const attempts = numberCode;
	const stringCode = String(numberCode).padStart(8, '0');
	const code = `CST-${stringCode}`;
	const course_id = CS.course_id;
	const student_id = CS.student_id;
	const schedule = CS.schedules.pop();
	//TIMEZONE
	const date = moment(`${schedule.date} ${schedule.hour}`)
		.subtract(4, 'hours')
		.format('YYYY-MM-DD HH:mm');
	const newCourseStudentTest = await CourseStudentTest.create({
		course_id,
		test_id,
		attempts,
		course_student_id,
		date,
		student_id,
		code,
	});
	return newCourseStudentTest;
};
const createCourseStudentTestQuestion = async (
	course_id,
	student_id,
	test_id,
	course_student_id,
	course_student_test_id,
	question_id,
) => {
	const newCourseStudentTestQuestion =
		await CourseStudentTestQuestion.create({
			course_id,
			student_id,
			test_id,
			course_student_id,
			course_student_test_id,
			question_id,
		});
	return newCourseStudentTestQuestion;
};
const createCourseStudentTestAnswer = async ({
	course_student_test_id,
	course_student_test_question_id,
	course_student_id,
	question_id,
	student_id,
	resp,
	test_id,
	course_id,
}) => {
	const selectedCourseStudentTestQuestion =
		await CourseStudentTestQuestion.findOne({
			where: { id: course_student_test_question_id },
		});
	selectedCourseStudentTestQuestion.Answered = true;
	selectedCourseStudentTestQuestion.save();
	const newCourseStudentTestAnswer =
		await CourseStudentTestAnswer.create({
			course_student_test_id,
			course_student_test_question_id,
			course_student_id,
			question_id,
			student_id,
			resp,
			test_id,
			course_id,
		});
	return newCourseStudentTestAnswer;
};
const updateCourseStudentTestAnswer = async (
	course_student_test_question_id,
	resp,
) => {
	const selectedCourseStudentTestAnswer =
		await CourseStudentTestAnswer.findOne({
			where: {
				course_student_test_question_id:
					course_student_test_question_id,
			},
		});
	selectedCourseStudentTestAnswer.resp = resp;
	selectedCourseStudentTestAnswer.save();
	return selectedCourseStudentTestAnswer;
};

const getCourseStudentTestAnswerByQuestion = async (
	course_student_test_question_id,
) => {
	const data = await CourseStudentTestAnswer.findOne({
		where: {
			course_student_test_question_id:
				course_student_test_question_id,
		},
	});
	return data;
};

const getAllCourseStudentTestAnswer = async (filters) => {
	const whereClause = {};
	if (filters.course_student_test_id) {
		whereClause.course_student_test_id =
			filters.course_student_test_id;
	}
	if (filters.course_student_id) {
		whereClause.course_student_id = filters.course_student_id;
	}
	if (filters.question_id) {
		whereClause.question_id = filters.question_id;
	}
	const data = await CourseStudentTestAnswer.findAll({
		where: whereClause,
		include: [
			{
				model: Question,
				include: [
					{
						model: Answer,
						where: {
							is_correct: true,
						},
					},
					{
						model: QuestionType,
					},
					{
						model: TestQuestionType,
					},
				],
			},
		],
	});
	return data;
};
const resolveCourseStudentTestAnswer = async (
	course_student_test_answer_id,
	scoreValue,
) => {
	const selectedCourseStudentTestAnswer =
		await CourseStudentTestAnswer.findOne({
			where: { id: course_student_test_answer_id },
		});
	selectedCourseStudentTestAnswer.score = scoreValue;
	await selectedCourseStudentTestAnswer.save();
};

const resolveCourseStudentTest = async (
	course_student_test_answer_id,
	score,
	rev,
) => {
	const courseStudentTest = await CourseStudentTest.findOne({
		where: { id: course_student_test_answer_id },
	});
	const courseStudent = await CourseStudent.findOne({
		where: { id: courseStudentTest.course_student_id },
	});

	const test = await Test.findOne({
		where: { id: courseStudentTest.test_id },
	});

	if (!courseStudentTest || !courseStudent || !test) {
		throw new Error(
			'courseStudent or courseStudentTest or Test Type not found',
		);
	}

	const approve = score >= test.min_score;
	let changeCS = false;
	if (score > courseStudent.score || rev) {
		courseStudent.score = score;
		changeCS = true;
	}
	if (!courseStudent.approve || rev) {
		courseStudent.approve = approve;
		changeCS = true;
	}
	if (changeCS) {
		await courseStudent.save();
	}
	courseStudentTest.score = score;
	courseStudentTest.approve = approve;
	courseStudentTest.finished = true;
	await courseStudentTest.save();
	return true;
};

/**
 * Reabre un intento ya presentado (`finished = true`) para que el alumno siga
 * respondiendo las mismas preguntas del examen que ya tenía cargado.
 *
 * - Idempotente: si el intento ya está abierto no reescribe nada.
 * - Limpia solo la evaluación del intento (`score` / `approve`), porque deja de
 *   estar "presentado y evaluado". El puntaje histórico de la matrícula
 *   (`course_student.score` / `approve`) NO se toca: al volver a finalizar se
 *   recalcula con `resolveCourseStudentTest` y solo mejora el máximo.
 * - Las preguntas y las respuestas se conservan; sus puntajes se recalculan al
 *   cerrar el intento otra vez.
 */
const reactivateCourseStudentTest = async (course_student_test_id) => {
	const courseStudentTest = await CourseStudentTest.findByPk(
		course_student_test_id,
	);
	if (!courseStudentTest) {
		throw httpError(404, 'Intento de examen no encontrado');
	}
	if (!courseStudentTest.finished) {
		return courseStudentTest;
	}
	await courseStudentTest.update({
		finished: false,
		score: null,
		approve: null,
	});
	return courseStudentTest;
};

const getTotalScore = async (course_student_test_id) => {
	try {
		const totalScore = await CourseStudentTestAnswer.sum('score', {
			where: { course_student_test_id },
		});

		return totalScore;
	} catch (error) {
		console.error('Error al obtener la suma de scores:', error);
	}
};

const getAllCourseStudentTestByStudentId = async (
	student_id,
	course_student_id,
) => {
	const whereClause = {
		student_id: student_id,
	};
	if (course_student_id) {
		whereClause.course_student_id = course_student_id;
	}
	const data = await CourseStudentTest.findAll({
		where: whereClause,
		include: [
			{ model: Test },
			{
				model: CourseStudent,
				include: [{ model: Course }],
			},
		],
		order: [
			[Sequelize.col('course_student_test.created_at'), 'DESC'],
		],
	});
	return data;
};

const getTestsByInstructor = async (filters = {}) => {
	const whereClause = {};

	if (filters.course_id) {
		whereClause.course_id = filters.course_id;
	}
	if (typeof filters.finished !== 'undefined') {
		whereClause.finished = filters.finished;
	}

	if (filters.instructor_id) {
		const csIds = await getCourseStudentIdsByInstructor(
			filters.instructor_id,
		);
		if (csIds.length === 0) {
			return {
				data: [],
				totalItems: 0,
				currentPage: parseInt(filters.currentPage) || 1,
				pageSize: parseInt(filters.pageSize) || 10,
				totalPages: 0,
			};
		}
		whereClause.course_student_id = { [Op.in]: csIds };
	}

	const pageSize = parseInt(filters.pageSize) || 10;
	const currentPage = parseInt(filters.currentPage) || 1;
	const offset = (currentPage - 1) * pageSize;

	const result = await CourseStudentTest.findAndCountAll({
		distinct: true,
		col: 'id',
		where: whereClause,
		include: [
			{ model: Test },
			{
				model: CourseStudent,
				include: [
					{
						model: models.Student,
						include: [{ model: models.User }],
					},
				],
			},
			{
				model: CourseStudentTestQuestion,
				include: [
					{
						model: CourseStudentTestAnswer,
					},
				],
			},
		],
		order: [['createdAt', 'DESC']],
		limit: pageSize,
		offset: offset,
	});

	return {
		data: result.rows,
		totalItems: result.count,
		currentPage,
		pageSize,
		totalPages: Math.ceil(result.count / pageSize),
	};
};

export {
	getAllTest,
	getTestById,
	getQuestionById,
	getAllTestCourse,
	getQuestionTypes,
	createTestQuestionType,
	updateQuestionType,
	createTest,
	updateTest,
	cloneTest,
	buildUniqueTestCode,
	createQuestionTest,
	updateQuestionTest,
	deleteQuestionById,
	deleteQuestionsByTestId,
	createAnswerQuestionTest,
	updateAnswerQuestionTest,
	updateTestQuestionType,
	getTestIdsByCourse,
	isTestLinkedToCourse,
	countCoursesByTest,
	countActiveCoursesByTest,
	getActiveTestsByCourse,
	getActiveTestByCourse,
	getCoursesByTest,
	linkTestToCourse,
	linkTestsToCourse,
	unlinkTestFromCourse,
	assertAnyLinkedCourseActive,
	getTestActivationConflicts,
	getAllCourseStudentTestAnswer,
	getCourseStudentTestById,
	getCourseStudentTestAnswerByQuestion,
	resolveCourseStudentTestAnswer,
	resolveCourseStudentTest,
	reactivateCourseStudentTest,
	updateCourseStudentTestAnswer,
	getQuestionTest,
	getAnswerQuestion,
	getCourseStudentTest,
	createCourseStudentTest,
	createCourseStudentTestQuestion,
	createCourseStudentTestAnswer,
	getTotalScore,
	getAllCourseStudentTestByStudentId,
	getTestsByInstructor,
};

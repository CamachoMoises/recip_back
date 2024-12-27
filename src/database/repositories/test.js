import moment from 'moment';
import { models } from '../initDB.js';
import { getCourseStudentById } from './course.js';
import { Op } from 'sequelize';

const {
	Test,
	QuestionType,
	TestQuestionType,
	Question,
	Answer,
	CourseStudent,
	CourseStudentTest,
	CourseStudentTestQuestion,
	CourseStudentTestAnswer,
} = models;

const getAllTest = async () => await Test.findAll();
const getTestById = async (id) => {
	const test = await Test.findOne({
		where: id,
		include: [
			{
				model: TestQuestionType,
				include: [QuestionType],
			},
		],
	});
	if (!test) {
		throw new Error('Question Type not found');
	} else {
		return test;
	}
};
const getAllTestCourse = async (filters) => {
	const whereClause = {};
	if (filters.course_id) {
		whereClause.course_id = filters.course_id;
	}
	const data = await Test.findAll({
		where: whereClause,
		include: [
			{
				model: TestQuestionType,
				include: [QuestionType],
			},
		],
	});
	return data;
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

const getQuestionTest = async (filters) => {
	const whereClause = {};
	if (filters.test_id) {
		whereClause.test_id = filters.test_id;
	}
	if (filters.question_type_id > 0) {
		whereClause.question_type_id = filters.question_type_id;
	}
	if (filters.course_id) {
		whereClause.course_id = filters.course_id;
	}
	const data = await Question.findAll({
		where: whereClause,
		order: [['updated_at', 'DESC']],
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
	course_id,
	amount,
	question_type_id,
	status,
	test_id,
}) => {
	const newTestQuestionType = await TestQuestionType.create({
		course_id,
		amount,
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

const updateTestQuestionType = async ({ id, amount, status }) => {
	const testQuestionType = await TestQuestionType.findByPk(id);
	if (!testQuestionType) {
		throw new Error('Test question Type not found');
	}
	await testQuestionType.update({ amount, status });
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
		//TIMEZONE
		whereClause.date = { [Op.lte]: `${filters.date} 19:59:59` };
	}
	const data = await CourseStudentTest.findAll({
		where: whereClause,
	});

	return data;
};

const createCourseStudentTest = async (
	course_student_id,
	test_id
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
	const newCourseStudentTest = CourseStudentTest.create({
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
	question_id
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
	resp
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
	course_student_test_question_id
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
				],
			},
		],
	});
	return data;
};
const resolveCourseStudentTestAnswer = async (
	course_student_test_answer_id,
	scoreValue
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
	score
) => {
	const courseStudentTest = await CourseStudentTest.findOne({
		where: { id: course_student_test_answer_id },
	});
	const courseStudent = await CourseStudent.findOne({
		where: { id: courseStudentTest.course_student_id },
	});
	courseStudent.score = score;
	await courseStudent.save();
	courseStudentTest.score = score;
	courseStudentTest.finished = true;
	await courseStudentTest.save();
	return true;
};

export {
	getAllTest,
	getTestById,
	getAllTestCourse,
	getQuestionTypes,
	createTestQuestionType,
	updateQuestionType,
	updateTestQuestionType,
	getAllCourseStudentTestAnswer,
	getCourseStudentTestById,
	getCourseStudentTestAnswerByQuestion,
	resolveCourseStudentTestAnswer,
	resolveCourseStudentTest,
	updateCourseStudentTestAnswer,
	getQuestionTest,
	getAnswerQuestion,
	getCourseStudentTest,
	createCourseStudentTest,
	createCourseStudentTestQuestion,
	createCourseStudentTestAnswer,
};

import moment from 'moment';
import { models } from '../initDB.js';
import { getCourseStudentById } from './course.js';
import { Op } from 'sequelize';

const {
	Test,
	QuestionType,
	Question,
	Answer,
	CourseStudentTest,
	CourseStudentTestQuestion,
} = models;

const getAllTest = async () => await Test.findAll();

const getAllTestCourse = async (filters) => {
	const whereClause = {};
	if (filters.course_id) {
		whereClause.course_id = filters.course_id;
	}
	const data = await Test.findAll({
		where: whereClause,
	});
	return data;
};

const getQuestionTest = async (filters) => {
	const whereClause = {};
	if (filters.test_id) {
		whereClause.test_id = filters.test_id;
	}
	if (filters.question_type_id) {
		whereClause.question_type_id = filters.question_type_id;
	}
	if (filters.course_id) {
		whereClause.course_id = filters.course_id;
	}
	const data = await Question.findAll({
		where: whereClause,
		order: [['question_type_id', 'ASC']],
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
	console.log(date, moment().format('HH:mm'));
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
		CourseStudentTestQuestion.create({
			course_id,
			student_id,
			test_id,
			course_student_id,
			course_student_test_id,
			question_id,
		});
	return newCourseStudentTestQuestion;
};
export {
	getAllTest,
	getAllTestCourse,
	getQuestionTest,
	getAnswerQuestion,
	getCourseStudentTest,
	createCourseStudentTest,
	createCourseStudentTestQuestion,
};

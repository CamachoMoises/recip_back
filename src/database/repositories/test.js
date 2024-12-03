import { models } from '../initDB.js';

const {
	Subject,
	SubjectDays,
	Test,
	QuestionType,
	Question,
	Answer,
	CourseStudent,
	CourseStudentTest,
} = models;

const getAllTest = async () => await Test.findAll();

const getAllTestCourse = async (id) => {
	const data = await Test.findAll({
		where: {
			course_id: id,
		},
	});
	return data;
};

const getQuestionTest = async (id) => {
	const data = await Question.findAll({
		where: {
			test_id: id,
		},
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
const getCourseStudentTestByCourseStudent = async (id) => {
	const data = await CourseStudentTest.findAll({
		where: {
			course_student_id: id,
		},
	});

	return data;
};

export {
	getAllTest,
	getAllTestCourse,
	getQuestionTest,
	getAnswerQuestion,
	getCourseStudentTestByCourseStudent,
};

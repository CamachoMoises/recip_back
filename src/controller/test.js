import moment from 'moment';
import {
	createCourseStudentTest,
	createCourseStudentTestQuestion,
	getAllTest,
	getAllTestCourse,
	getAnswerQuestion,
	getCourseStudentTest,
	getQuestionTest,
} from '../database/repositories/test.js';
import { getRandomSubset } from './utilities.js';

export const ListTest = async (req, res) => {
	try {
		const test = await getAllTest();
		res.send(test);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListTestCourse = async (req, res) => {
	const filters = {
		course_id: req.params.course_id,
	};
	try {
		const test = await getAllTestCourse(filters);
		res.send(test);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const ListQuestionTest = async (req, res) => {
	const filters = {
		test_id: req.params.test_id,
	};
	try {
		const question = await getQuestionTest(filters);
		res.send(question);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListAnswerQuestion = async (req, res) => {
	const id = req.params.id;
	try {
		const answer = await getAnswerQuestion(id);
		res.send(answer);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CourseStudentTest = async (req, res) => {
	const currentDate = moment();
	let exist = false;
	const filters = {
		course_student_id: req.params.course_student_id,
		test_id: req.params.test_id,
		finished: false,
		date: req.body.date,
	};
	const details = await getCourseStudentTest(filters);
	if (details.length > 0) {
		const data = details.pop();
		//TIMEZONE
		const dateTest = moment(data.date).add(4, 'hours');
		const horas = currentDate.diff(dateTest, 'hours', true);
		if (horas < 2 && horas > 0) {
			exist = true;
		}
	}
	try {
		if (!exist) {
			const courseStudentTest = await createCourseStudentTest(
				filters.course_student_id,
				filters.test_id
			);
			res.send(courseStudentTest);
		} else {
			const courseStudentTest = await getCourseStudentTest(filters);
			const courseStudentTestSelected = courseStudentTest.pop();
			CourseStudentTestQuestions(courseStudentTestSelected, 1, 2);

			res.send(courseStudentTestSelected);
		}
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);

		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
		// .send(`Input Validation Error ${course_student_id}`)
	}
};

const CourseStudentTestQuestions = async (
	courseStudentTest,
	question_type_id,
	questionQuantity
) => {
	const filters = {
		test_id: courseStudentTest.test_id,
		question_type_id: question_type_id,
	};
	const questions = await getQuestionTest(filters);
	const id = questions.map((question) => {
		return question.id;
	});
	try {
		const random_id = getRandomSubset(id, questionQuantity);
		random_id.forEach(async (new_id) => {
			await createCourseStudentTestQuestion(
				courseStudentTest.course_id,
				courseStudentTest.student_id,
				courseStudentTest.test_id,
				courseStudentTest.course_student_id,
				courseStudentTest.id,
				new_id
			);
		});
	} catch (error) {
		console.log(error);
	}
};

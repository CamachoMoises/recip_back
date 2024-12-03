import moment from 'moment';
import {
	getAllTest,
	getAllTestCourse,
	getAnswerQuestion,
	getCourseStudentTestByCourseStudent,
	getQuestionTest,
} from '../database/repositories/test.js';

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
	const id = req.params.id;
	try {
		const test = await getAllTestCourse(id);
		res.send(test);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const ListQuestionTest = async (req, res) => {
	const test_id = req.params.test_id;
	try {
		const question = await getQuestionTest(test_id);
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

export const CreateCourseStudentTest = async (req, res) => {
	const currentDate = moment();
	let exist = false;
	const course_student_id = req.params.course_student_id;
	// const test_id = req.params.test_id;
	const details = await getCourseStudentTestByCourseStudent(
		course_student_id
	);
	if (details.length > 0) {
		const data = details.pop();
		const dateTest = moment(data.date).add(4, 'hours');
		const horas = currentDate.diff(dateTest, 'hours', true);
		if (horas < 2 && horas > 0) {
			exist = true;
		}
	}
	try {
		if (!exist) {
			// const courseStudentTest = await createCourseStudentTest(
			// 	course_student_id,
			// 	test_id
			// );
			// res.send(courseStudentTest);
			res.status(400);
		} else {
			const courseStudentTest =
				await getCourseStudentTestByCourseStudent(course_student_id);
			res.send(courseStudentTest.pop());
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

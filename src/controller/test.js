import {
	getAllTest,
	getAllTestCourse,
	getAnswerQuestion,
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
	const id = req.params.id;
	try {
		const question = await getQuestionTest(id);
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
	const course_student_id = req.params.course_student_id;
	console.log(course_student_id, 'ojo');
	// try {
	// 	const courseStudentTest = await createCourseStudent(
	// 		course_student_id
	// 	);
	// 	res.send(courseStudentTest);
	// } catch (error) {
	// 	console.error('Error en la creacion:', error.message);
	// 	console.log(error.message);

	return (
		res
			.status(400)
			// .send(`Input Validation Error ${error.message}`);
			.send(`Input Validation Error ${course_student_id}`)
	);
	// }
};

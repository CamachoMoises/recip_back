import moment from 'moment';
import {
	createCourseStudentTest,
	createCourseStudentTestAnswer,
	createCourseStudentTestQuestion,
	getAllCourseStudentTestAnswer,
	getAllTest,
	getAllTestCourse,
	getAnswerQuestion,
	getCourseStudentTest,
	getCourseStudentTestAnswerByQuestion,
	getCourseStudentTestById,
	getQuestionTest,
	resolveCourseStudentTest,
	resolveCourseStudentTestAnswer,
	updateCourseStudentTestAnswer,
} from '../database/repositories/test.js';
import { cleanString, getRandomSubset } from './utilities.js';

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
	let course_student_id = -1;
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
			course_student_id = data.id;
		}
	}
	try {
		if (!exist) {
			const courseStudentTest = await createCourseStudentTest(
				filters.course_student_id,
				filters.test_id
			);
			await CourseStudentTestQuestions(courseStudentTest, 1, 2);
			await CourseStudentTestQuestions(courseStudentTest, 2, 2);
			await CourseStudentTestQuestions(courseStudentTest, 3, 2);
			await CourseStudentTestQuestions(courseStudentTest, 5, 2);
			course_student_id = courseStudentTest.id;
		}

		const courseStudentTestSelected = await getCourseStudentTestById(
			course_student_id
		);
		res.send(courseStudentTestSelected);
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);

		return res.status(400).send(`Error ${error.message}`);
		// .send(`Error ${course_student_id}`)
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
		console.log(random_id);
		for (const new_id of random_id) {
			await createCourseStudentTestQuestion(
				courseStudentTest.course_id,
				courseStudentTest.student_id,
				courseStudentTest.test_id,
				courseStudentTest.course_student_id,
				courseStudentTest.id,
				new_id
			);
		}
	} catch (error) {
		console.log(error);
	}
	return id;
};

export const CourseStudentTestAnswer = async (req, res) => {
	try {
		const CSTA = req.body.courseStudentTestAnswer;
		const exist = await getCourseStudentTestAnswerByQuestion(
			CSTA.course_student_test_question_id
		);
		if (exist) {
			const data = await updateCourseStudentTestAnswer(
				CSTA.course_student_test_question_id,
				CSTA.resp
			);
			return res.send(data);
		} else {
			const data = await createCourseStudentTestAnswer({
				course_student_test_id: CSTA.course_student_test_id,
				course_student_test_question_id:
					CSTA.course_student_test_question_id,
				course_student_id: CSTA.course_student_id,
				question_id: CSTA.question_id,
				student_id: CSTA.student_id,
				resp: CSTA.resp,
				test_id: CSTA.test_id,
				course_id: CSTA.course_id,
			});
			return res.send(data);
		}
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);

		return res.status(400).send(`Error ${error.message}`);
	}
};

export const CourseStudentTestEnd = async (req, res) => {
	try {
		const course_student_test_id = req.body.course_student_test_id;
		console.log(course_student_test_id);
		const filters = {
			course_student_test_id: course_student_test_id,
		};
		const courseStudentTestAnswers =
			await getAllCourseStudentTestAnswer(filters);
		const score = await evaluateAnswers(courseStudentTestAnswers);
		console.log('The score is', score);
		await resolveCourseStudentTest(
			filters.course_student_test_id,
			score
		);
		const dataResponse = {
			answers: courseStudentTestAnswers,
			score: score,
		};
		return res.send(dataResponse);
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);

		return res.status(400).send(`Error ${error.message}`);
	}
};

export const evaluateAnswers = async (courseStudentTestAnswers) => {
	let score = 0;

	for (const answer of courseStudentTestAnswers) {
		const resp = JSON.parse(answer.resp);
		const scoreValue = answer.question.question_type.value;
		let correctas = 0;
		let incorrectas = 0;
		let rspCheck = [];
		const correct_answers = answer.question.answers.map((CorAnsw) => {
			return {
				id: CorAnsw.id,
				is_correct: CorAnsw.is_correct,
				value: cleanString(CorAnsw.value),
			};
		});
		const countResp = correct_answers.length;
		switch (answer.question.question_type_id) {
			case 1:
				if (resp === correct_answers[0].id) {
					console.log(`LA RESPUESTA DE LA ${answer.id} es correcta`);
					await resolveCourseStudentTestAnswer(answer.id, scoreValue);
					score = score + scoreValue;
				} else {
					console.log(
						`LA RESPUESTA DE LA ${answer.id} es incorrecta`
					);
					await resolveCourseStudentTestAnswer(answer.id, 0);
				}
				break;

			case 2:
				rspCheck = resp.filter((respAll) => respAll.check);

				for (const RSC of rspCheck) {
					if (
						correct_answers.find((CorAnsw) => CorAnsw.id === RSC.id)
					) {
						correctas++;
					} else {
						incorrectas++;
					}
				}
				console.log(
					'el puntaje del id ',
					answer.id,
					'es',
					(correctas * scoreValue) / countResp -
						(incorrectas * scoreValue) / countResp
				);
				score =
					score +
					(correctas * scoreValue) / countResp -
					(incorrectas * scoreValue) / countResp;
				await resolveCourseStudentTestAnswer(
					answer.id,
					(correctas * scoreValue) / countResp -
						(incorrectas * scoreValue) / countResp
				);
				break;

			case 3:
				if (resp === correct_answers[0].id) {
					console.log(`LA RESPUESTA DE LA ${answer.id} es correcta`);
					await resolveCourseStudentTestAnswer(answer.id, scoreValue);
					score = score + scoreValue;
				} else {
					console.log(
						`LA RESPUESTA DE LA ${answer.id} es incorrecta`
					);
					await resolveCourseStudentTestAnswer(answer.id, 0);
				}
				break;

			case 4:
				for (const detalisRes of resp) {
					if (
						correct_answers.find(
							(val) => val.value === cleanString(detalisRes)
						)
					) {
						correctas++;
					}
				}
				console.log(
					'el puntaje del id ',
					answer.id,
					'es',
					(correctas * scoreValue) / countResp
				);
				score = score + (correctas * scoreValue) / countResp;
				await resolveCourseStudentTestAnswer(
					answer.id,
					(correctas * scoreValue) / countResp
				);
				break;
			case 5:
				for (const detalisRes of resp) {
					if (
						correct_answers.find(
							(val) => val.value === cleanString(detalisRes)
						)
					) {
						correctas++;
					}
				}
				console.log(
					'el puntaje del id ',
					answer.id,
					'es',
					(correctas * scoreValue) / countResp
				);
				score = score + (correctas * scoreValue) / countResp;
				await resolveCourseStudentTestAnswer(
					answer.id,
					(correctas * scoreValue) / countResp
				);
				break;

			default:
				console.log('unknown case');
				break;
		}
	}
	return score;
};

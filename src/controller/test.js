import moment from 'moment';
import {
	createAnswerQuestionTest,
	createCourseStudentTest,
	createCourseStudentTestAnswer,
	createCourseStudentTestQuestion,
	createQuestionTest,
	createTest,
	createTestQuestionType,
	getAllCourseStudentTestAnswer,
	getAllTest,
	getAllTestCourse,
	getAnswerQuestion,
	getCourseStudentTest,
	getCourseStudentTestAnswerByQuestion,
	getCourseStudentTestById,
	getQuestionById,
	getQuestionTest,
	getQuestionTypes,
	getTestById,
	getTotalScore,
	resolveCourseStudentTest,
	resolveCourseStudentTestAnswer,
	updateAnswerQuestionTest,
	updateCourseStudentTestAnswer,
	updateQuestionTest,
	updateQuestionType,
	updateTest,
	updateTestQuestionType,
} from '../database/repositories/test.js';
import {
	cleanString,
	getRandomSubset,
	redondear,
} from './utilities.js';
import { getCourseStudentById } from '../database/repositories/course.js';

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
	try {
		const filters = {
			course_id: req.params.course_id,
		};
		const tests = await getAllTestCourse(filters);
		res.send(tests);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const TestCourseDetail = async (req, res) => {
	const test_id = parseInt(req.params.test_id);
	try {
		if (test_id > 0) {
			const test = await getTestById(test_id);
			res.send(test);
		} else {
			res.status(500).send('Internal Server Error Test_not_fund');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListQuestionTest = async (req, res) => {
	const filters = {
		test_id: parseInt(req.params.test_id),
		question_type_id: parseInt(req.query.question_type_id),
		test_question_type_id: parseInt(req.query.test_question_type_id),
	};
	try {
		const question = await getQuestionTest(filters);
		res.send(question);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListQuestionTypes = async (req, res) => {
	try {
		const questionTypes = await getQuestionTypes();
		res.send(questionTypes);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateQuestionType = async (req, res) => {
	try {
		const data = req.body;
		const { id, value } = data;
		const editedQuestionSubject = await updateQuestionType({
			id,
			value,
		});
		res.status(201).send(editedQuestionSubject);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const CreateTest = async (req, res) => {
	try {
		const data = req.body;
		const { course_id, duration, min_score } = data;
		const testCreate = await createTest({
			course_id,
			duration,
			min_score,
		});
		const newTest = await getTestById({ id: testCreate.id });
		res.status(201).send(newTest);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const UpdateTest = async (req, res) => {
	try {
		const data = req.body;
		const { id, duration, min_score, status } = data;
		await updateTest({
			id,
			duration,
			min_score,
			status,
		});
		const newTest = await getTestById({ id });
		res.status(201).send(newTest);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const CreateQuestionTest = async (req, res) => {
	try {
		const data = req.body;
		const {
			course_id,
			test_id,
			question_type_id,
			test_question_type_id,
			header,
		} = data;
		const questionCreate = await createQuestionTest({
			course_id,
			test_id,
			question_type_id,
			test_question_type_id,
			header,
		});
		const newQuestion = await getQuestionById({
			id: questionCreate.id,
		});
		res.status(201).send(newQuestion);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const UpdateQuestionTest = async (req, res) => {
	try {
		const data = req.body;
		const { id, header, status } = data;
		await updateQuestionTest({
			id,
			header,
			status,
		});
		const newQuestion = await getQuestionById({ id });
		res.status(201).send(newQuestion);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateAnswerQuestionTest = async (req, res) => {
	try {
		const data = req.body;
		const {
			course_id,
			test_id,
			question_type_id,
			question_id,
			value,
		} = data;
		const answer = await createAnswerQuestionTest({
			course_id,
			test_id,
			question_type_id,
			question_id,
			value,
		});
		if (answer) {
			const newQuestion = await getQuestionById({ id: question_id });
			res.status(201).send(newQuestion);
		} else {
			throw new Error('Answer not created');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateAnswerQuestionTest = async (req, res) => {
	try {
		const data = req.body;
		const { id, value, is_correct, status } = data;
		const question_id = parseInt(req.params.question_id);
		await updateAnswerQuestionTest({
			id,
			value,
			is_correct,
			status,
		});
		const newQuestion = await getQuestionById({ id: question_id });
		res.status(201).send(newQuestion);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateTestQuestionType = async (req, res) => {
	try {
		const data = req.body;
		const {
			id,
			course_id,
			amount,
			value,
			question_type_id,
			status,
			test_id,
		} = data;
		if (id > 0) {
			const updateTQT = await updateTestQuestionType({
				id,
				amount,
				value,
				status,
			});
			// console.log(updateTQT, 'OJO');
			if (updateTQT) {
				const test = await getTestById(test_id);
				res.status(201).send(test);
			}
		} else {
			const createTQT = await createTestQuestionType({
				course_id,
				amount,
				value,
				question_type_id,
				status,
				test_id,
			});

			if (createTQT) {
				const test = await getTestById(test_id);
				res.status(201).send(test);
			}
		}
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
export const CourseStudentTestDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const courseStudentTestSelected = await getCourseStudentTestById(
			id
		);
		res.send(courseStudentTestSelected);
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);

		return res.status(400).send(`Error ${error.message}`);
		// .send(`Error ${course_student_id}`)
	}
};
export const CourseStudentTest = async (req, res) => {
	try {
		const currentDate = moment();
		const courseStudent = await getCourseStudentById(
			req.params.course_student_id
		);
		const test = courseStudent.course.tests.find(
			(dataTest) => dataTest.status
		);
		if (!test.id) {
			throw new Error('Question Type not found');
		}
		const testData = await getTestById(test.id);
		let exist = false;
		let course_student_id = -1;
		const filters = {
			course_student_id: req.params.course_student_id,
			test_id: test.id,
			finished: false,
			date: req.body.date,
		};
		const details = await getCourseStudentTest(filters);
		if (details.length > 0) {
			const data = details.pop();
			//TIMEZONE TO DO
			const dateTest = moment(data.date).add(4, 'hours');
			const horas = currentDate.diff(dateTest, 'hours', true);
			if (horas < 2 && horas > 0) {
				exist = true;
				course_student_id = data.id;
			}
		}
		if (!exist) {
			const courseStudentTest = await createCourseStudentTest(
				filters.course_student_id,
				filters.test_id
			);

			for (
				let index = 0;
				index < testData.test_question_types.length;
				index++
			) {
				const TQT = testData.test_question_types[index];
				if (TQT.question_type_id != 4 && TQT.amount > 0) {
					await CourseStudentTestQuestions(
						courseStudentTest,
						TQT.question_type_id,
						TQT.amount
					);
				} else if (TQT.question_type_id === 4 && TQT.amount > 0) {
					const questionFilters = {
						test_id: filters.test_id,
						question_type_id: 4,
					};
					const questionsType_4 = await getQuestionTest(
						questionFilters
					);
					for (const questionType_4 of questionsType_4) {
						await createCourseStudentTestQuestion(
							courseStudentTest.course_id,
							courseStudentTest.student_id,
							courseStudentTest.test_id,
							courseStudentTest.course_student_id,
							courseStudentTest.id,
							questionType_4.id
						);
					}
				}
			}
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
	}
};

const CourseStudentTestQuestions = async (
	courseStudentTest,
	question_type_id,
	question_Amount
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
		const random_id = getRandomSubset(id, question_Amount);
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
		const filters = {
			course_student_test_id: course_student_test_id,
		};
		const courseStudentTestAnswers =
			await getAllCourseStudentTestAnswer(filters);
		const score = await evaluateAnswers(courseStudentTestAnswers);
		console.log('The score is', score);
		await resolveCourseStudentTest(
			filters.course_student_test_id,
			score,
			false
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
		const scoreValue = answer.question.test_question_type.value;
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
					redondear(
						(correctas * scoreValue) / countResp -
							(incorrectas * scoreValue) / countResp,
						4
					)
				);
				score =
					score +
					redondear(
						(correctas * scoreValue) / countResp -
							(incorrectas * scoreValue) / countResp,
						4
					);
				await resolveCourseStudentTestAnswer(
					answer.id,
					redondear(
						(correctas * scoreValue) / countResp -
							(incorrectas * scoreValue) / countResp,
						4
					)
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
					} else {
						incorrectas++;
					}
				}
				console.log(
					'el puntaje del id ',
					answer.id,
					'es',
					redondear((correctas * scoreValue) / countResp, 4),
					' con ',
					correctas,
					' correctas'
				);
				score =
					score + redondear((correctas * scoreValue) / countResp, 4);
				await resolveCourseStudentTestAnswer(
					answer.id,
					redondear((correctas * scoreValue) / countResp, 4)
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
					} else {
						incorrectas++;
					}
				}
				console.log(
					'el puntaje del id ',
					answer.id,
					'es',
					redondear((correctas * scoreValue) / countResp, 4),
					' con ',
					correctas,
					' correctas',
					' y ',
					incorrectas,
					' incorrectas'
				);
				score =
					score + redondear((correctas * scoreValue) / countResp, 4);
				await resolveCourseStudentTestAnswer(
					answer.id,
					redondear((correctas * scoreValue) / countResp, 4)
				);
				break;

			default:
				console.log('unknown case');
				break;
		}
	}
	return score;
};

export const UpdateCourseStudentTestScore = async (req, res) => {
	try {
		const course_student_test_id = req.body.course_student_test_id;
		const course_student_test_answer_id =
			req.body.course_student_test_answer_id;
		const score = req.body.score;
		console.log(
			score,
			course_student_test_answer_id,
			course_student_test_id
		);
		await resolveCourseStudentTestAnswer(
			parseInt(course_student_test_answer_id),
			parseFloat(score)
		);
		const totalScore = await getTotalScore(course_student_test_id);
		console.log(totalScore);
		await resolveCourseStudentTest(
			course_student_test_id,
			totalScore,
			true
		);
		const courseStudentTestSelected = await getCourseStudentTestById(
			course_student_test_id
		);
		res.send(courseStudentTestSelected);
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);

		return res.status(400).send(`Error ${error.message}`);
	}
};

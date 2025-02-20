import express from 'express';
import multer from 'multer';
import {
	CourseStudentTest,
	CourseStudentTestAnswer,
	CourseStudentTestDetails,
	CourseStudentTestEnd,
	CreateAnswerQuestionTest,
	CreateQuestionTest,
	CreateTest,
	ListAnswerQuestion,
	ListQuestionTest,
	ListQuestionTypes,
	ListTest,
	ListTestCourse,
	TestCourseDetail,
	UpdateAnswerQuestionTest,
	UpdateCourseStudentTestScore,
	UpdateQuestionTest,
	UpdateQuestionType,
	UpdateTest,
	UpdateTestQuestionType,
} from '../controller/test.js';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

router.get('/', authenticateJWT, ListTest);
router.get('/tests/:course_id', authenticateJWT, ListTestCourse);
router.get('/test/:test_id', authenticateJWT, TestCourseDetail);
router.get('/questions/:test_id', authenticateJWT, ListQuestionTest);
router.get('/questionTypes', authenticateJWT, ListQuestionTypes);
router.get('/answers/:id', authenticateJWT, ListAnswerQuestion);
router.put(
	'/questionTypes',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateQuestionType
);
router.post(
	'/test',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateTest
);
router.put(
	'/test',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateTest
);
router.post(
	'/questionTest',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateQuestionTest
);
router.put(
	'/questionTest',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateQuestionTest
);
router.post(
	'/answerQuestionTest',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateAnswerQuestionTest
);

router.put(
	'/answerQuestionTest/:question_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateAnswerQuestionTest
);

router.put(
	'/testQuestionTypes',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateTestQuestionType
);

router.get('/courseStudentTest/:id', CourseStudentTestDetails);
router.post(
	'/courseStudentTest/:course_student_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CourseStudentTest
);

router.post(
	'/courseStudentTestAnswer',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CourseStudentTestAnswer
);

router.post(
	'/courseStudentTestEnd',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CourseStudentTestEnd
);
router.put(
	'/updateCourseStudentTestScore',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateCourseStudentTestScore
);
export default router;

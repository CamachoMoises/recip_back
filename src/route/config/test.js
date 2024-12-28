import express from 'express';
import multer from 'multer';
import {
	CourseStudentTest,
	CourseStudentTestAnswer,
	CourseStudentTestDetails,
	CourseStudentTestEnd,
	ListAnswerQuestion,
	ListQuestionTest,
	ListQuestionTypes,
	ListTest,
	ListTestCourse,
	TestCourseDetail,
	UpdateAnswerQuestionTest,
	UpdateQuestionTest,
	UpdateQuestionType,
	UpdateTestQuestionType,
} from '../../controller/test.js';
import convertTypes from '../../middleware/convertTypes.js';

const upload = multer();
const router = express.Router();

router.get('/', ListTest);
router.get('/tests/:course_id', ListTestCourse);
router.get('/test/:test_id', TestCourseDetail);
router.get('/questions/:test_id', ListQuestionTest);
router.get('/questionTypes', ListQuestionTypes);
router.get('/answers/:id', ListAnswerQuestion);
router.put(
	'/questionTypes',
	upload.none(),
	convertTypes,
	UpdateQuestionType
);

router.put(
	'/questionTest',
	upload.none(),
	convertTypes,
	UpdateQuestionTest
);

router.put(
	'/answerQuestionTest/:question_id',
	upload.none(),
	convertTypes,
	UpdateAnswerQuestionTest
);

router.put(
	'/testQuestionTypes',
	upload.none(),
	convertTypes,
	UpdateTestQuestionType
);

router.get('/courseStudentTest/:id', CourseStudentTestDetails);
router.post(
	'/courseStudentTest/:course_student_id/:test_id',
	upload.none(),
	convertTypes,
	CourseStudentTest
);

router.post(
	'/courseStudentTestAnswer',
	upload.none(),
	convertTypes,
	CourseStudentTestAnswer
);

router.post(
	'/courseStudentTestEnd',
	upload.none(),
	convertTypes,
	CourseStudentTestEnd
);
export default router;

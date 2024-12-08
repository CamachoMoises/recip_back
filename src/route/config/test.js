import express from 'express';
import multer from 'multer';
import {
	CourseStudentTest,
	CourseStudentTestAnswer,
	CourseStudentTestEnd,
	ListAnswerQuestion,
	ListQuestionTest,
	ListTest,
	ListTestCourse,
} from '../../controller/test.js';
import convertTypes from '../../middleware/convertTypes.js';

const upload = multer();
const router = express.Router();

router.get('/', ListTest);
router.get('/tests/:course_id', ListTestCourse);
router.get('/questions/:test_id', ListQuestionTest);
router.get('/answers/:id', ListAnswerQuestion);
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

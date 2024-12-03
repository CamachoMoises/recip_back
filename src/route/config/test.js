import express from 'express';
import multer from 'multer';
import {
	CreateCourseStudentTest,
	ListAnswerQuestion,
	ListQuestionTest,
	ListTest,
	ListTestCourse,
} from '../../controller/test.js';
import convertTypes from '../../middleware/convertTypes.js';

const upload = multer();
const router = express.Router();

router.get('/', ListTest);
router.get('/tests/:id', ListTestCourse);
router.get('/questions/:test_id', ListQuestionTest);
router.get('/answers/:id', ListAnswerQuestion);
router.post(
	'/courseStudentTest/:course_student_id/:test_id',
	upload.none(),
	convertTypes,
	CreateCourseStudentTest
);

export default router;

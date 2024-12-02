import express from 'express';
import multer from 'multer';
import {
	ListAnswerQuestion,
	ListQuestionTest,
	ListTest,
	ListTestCourse,
} from '../../controller/test.js';

const upload = multer();
const router = express.Router();

router.get('/', ListTest);
router.get('/tests/:id', ListTestCourse);
router.get('/questions/:id', ListQuestionTest);
router.get('/answers/:id', ListAnswerQuestion);

export default router;

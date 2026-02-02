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
	ImportQuestionsFromCSV,
	ImportQuestionsFromExcel,
	ListAnswerQuestion,
	ListQuestionTypes,
	ListQuestionsByTest,
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

// Configure multer for file uploads (Excel)
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
			file.mimetype === 'application/vnd.ms-excel'
		) {
			cb(null, true);
		} else {
			cb(new Error('Only Excel files are allowed'), false);
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});

// Configure multer for CSV uploads
const uploadCSV = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype === 'text/csv' ||
			file.mimetype === 'application/csv' ||
			file.mimetype === 'text/plain' ||
			file.originalname.endsWith('.csv')
		) {
			cb(null, true);
		} else {
			cb(new Error('Only CSV files are allowed'), false);
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});

const router = express.Router();

router.get('/', authenticateJWT, ListTest);
router.get('/tests/:course_id', authenticateJWT, ListTestCourse);
router.get('/test/:test_id', authenticateJWT, TestCourseDetail);
router.get(
	'/questions/by-test/:test_id',
	authenticateJWT,
	ListQuestionsByTest
);
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

// Excel import route
router.post(
	'/import-excel/:test_id',
	upload.single('excel_file'),
	authenticateJWT,
	ImportQuestionsFromExcel
);

// CSV import route
router.post(
	'/import-csv',
	uploadCSV.single('csv_file'),
	// authenticateJWT,
	ImportQuestionsFromCSV
);

export default router;

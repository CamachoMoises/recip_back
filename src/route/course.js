import express from 'express';
import multer from 'multer';
import convertTypes from '../middleware/convertTypes.js';

// import multer from 'multer';
import {
	CourseDetails,
	CourseStudentDetails,
	CreateCourse,
	CreateCourseStudent,
	CreateSchedule,
	ListCourses,
	ListCoursesLevel,
	ListCoursesStudent,
	ListCoursesTypes,
	ListSchedule,
	UpdateCourse,
	UpdateCourseStudent,
	UpdateSchedule,
} from '../controller/course.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', authenticateJWT, ListCourses);
router.get('/coursesStudents', authenticateJWT, ListCoursesStudent);
router.post(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateCourse
);
router.put(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateCourse
);
router.get('/courseTypes', authenticateJWT, ListCoursesTypes);
router.get('/courseLevel', authenticateJWT, ListCoursesLevel);
router.post(
	'/courseStudent/:course_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateCourseStudent
);
router.put(
	'/courseStudent/:course_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateCourseStudent
);

router.get('/course/:id', authenticateJWT, CourseDetails);
router.get(
	'/courseStudent/:id',
	authenticateJWT,
	CourseStudentDetails
);
router.get('/schedule/:id', authenticateJWT, ListSchedule);
router.post(
	'/schedule',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateSchedule
);
router.put('/schedule', upload.none(), convertTypes, UpdateSchedule);

export default router;

import express from 'express';
import multer from 'multer';
import convertTypes from '../../middleware/convertTypes.js';

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
} from '../../controller/course.js';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListCourses);
router.get('/coursesStudents', ListCoursesStudent);
router.post('/', upload.none(), convertTypes, CreateCourse);
router.put('/', upload.none(), convertTypes, UpdateCourse);
router.get('/courseTypes', ListCoursesTypes);
router.get('/courseLevel', ListCoursesLevel);
router.post(
	'/courseStudent/:course_id',
	upload.none(),
	convertTypes,
	CreateCourseStudent
);
router.put(
	'/courseStudent/:course_id',
	upload.none(),
	convertTypes,
	UpdateCourseStudent
);

router.get('/course/:id', CourseDetails);
router.get('/courseStudent/:id', CourseStudentDetails);
router.get('/schedule/:id', ListSchedule);
router.post('/schedule', upload.none(), convertTypes, CreateSchedule);
router.put('/schedule', upload.none(), convertTypes, UpdateSchedule);

export default router;

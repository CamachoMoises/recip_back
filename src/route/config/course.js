import express from 'express';
import multer from 'multer';
import convertTypes from '../../middleware/convertTypes.js';

// import multer from 'multer';
import {
	CourseDetails,
	CourseStudentDetails,
	CreateCourse,
	CreateCourseStudent,
	ListCourses,
	ListCoursesLevel,
	ListCoursesStudent,
	ListCoursesTypes,
	UpdateCourse,
	UpdateCourseStudent,
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

export default router;

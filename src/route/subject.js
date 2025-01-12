import express from 'express';
import multer from 'multer';
import {
	CreateSubject,
	ListSubjects,
	ListSubjectsCourse,
	UpdateSubject,
	ChangeStatusDay,
	SubjectDetails,
	ChangeStatusLessonDay,
	CreateSubjectLesson,
	UpdateSubjectLesson,
	ListSubjectsLessonCourse,
} from '../controller/subject.js';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

// Rutas para asingnaciones
router.get('/', authenticateJWT, ListSubjects);
router.post(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateSubject
);
router.post(
	'/lesson',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateSubjectLesson
);
router.put(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateSubject
);
router.put(
	'/lesson',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateSubjectLesson
);
router.get('/course/:id', authenticateJWT, ListSubjectsCourse);
router.get(
	'/lesson/course/:id',
	authenticateJWT,
	ListSubjectsLessonCourse
);
router.get('/subject/:id', authenticateJWT, SubjectDetails);
router.post(
	'/subjects_days',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ChangeStatusDay
);
router.post(
	'/subjects_lesson_days',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ChangeStatusLessonDay
);

export default router;

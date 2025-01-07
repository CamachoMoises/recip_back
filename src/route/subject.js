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
} from '../controller/subject.js';
import convertTypes from '../middleware/convertTypes.js';

const upload = multer();
const router = express.Router();

// Rutas para asingnaciones
router.get('/', ListSubjects);
router.post('/', upload.none(), convertTypes, CreateSubject);
router.post(
	'/lesson',
	upload.none(),
	convertTypes,
	CreateSubjectLesson
);
router.put('/', upload.none(), convertTypes, UpdateSubject);
router.put(
	'/lesson',
	upload.none(),
	convertTypes,
	UpdateSubjectLesson
);
router.get('/course/:id', ListSubjectsCourse);
router.get('/subject/:id', SubjectDetails);
router.post(
	'/subjects_days',
	upload.none(),
	convertTypes,
	ChangeStatusDay
);
router.post(
	'/subjects_lesson_days',
	upload.none(),
	convertTypes,
	ChangeStatusLessonDay
);

export default router;

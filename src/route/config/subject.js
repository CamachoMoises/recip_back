import express from 'express';
import multer from 'multer';
import {
	CreateSubject,
	ListSubjects,
	ListSubjectsCourse,
	UpdateSubject,
	ChangeStatusDay,
} from '../../controller/subject.js';
import convertTypes from '../../middleware/convertTypes.js';

const upload = multer();
const router = express.Router();

// Rutas para asingnaciones
router.get('/', ListSubjects);
router.post('/', upload.none(), convertTypes, CreateSubject);
router.put('/', upload.none(), convertTypes, UpdateSubject);
router.get('/course/:id', ListSubjectsCourse);
router.post(
	'/subjects_days',
	upload.none(),
	convertTypes,
	ChangeStatusDay
);

export default router;

import express from 'express';
import multer from 'multer';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';
import {
	ListScheduleByInstructor,
	ListAssessmentsByInstructor,
	ListTestsByInstructor,
} from '../controller/instructor.js';

const upload = multer();
const router = express.Router();

router.get(
	'/schedule/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListScheduleByInstructor,
);

router.get(
	'/assessments',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListAssessmentsByInstructor,
);

router.get(
	'/tests',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListTestsByInstructor,
);

export default router;

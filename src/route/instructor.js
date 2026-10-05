import express from 'express';
import multer from 'multer';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';
import {
	ListScheduleByInstructor,
	ListAssessmentsByInstructor,
	ListTestsByInstructor,
	ListSchedulesByInstructorGrouped,
	ListTestsByInstructorWithParticipation,
	ListAttendanceByInstructorGrouped,
	ListEvaluationsByInstructorGrouped,
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
	'/schedules/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListScheduleByInstructor,
);

router.get(
	'/schedule/grouped/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListSchedulesByInstructorGrouped,
);

router.get(
	'/schedules/grouped/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListSchedulesByInstructorGrouped,
);

router.get(
	'/assessments',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListAssessmentsByInstructor,
);

router.get(
	'/tests/with-participation/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListTestsByInstructorWithParticipation,
);

router.get(
	'/attendance/grouped/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListAttendanceByInstructorGrouped,
);

router.get(
	'/evaluations/grouped/:instructor_id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListEvaluationsByInstructorGrouped,
);

router.get(
	'/tests',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ListTestsByInstructor,
);

export default router;

import express from 'express';
import multer from 'multer';
import { authenticateJWT } from '../controller/authentication.js';
import convertTypes from '../middleware/convertTypes.js';
import {
	CreateCourseStudentAssessment,
	CourseStudentAssessmentDetails,
	CourseStudentAssessmentDay,
	UpdateCourseStudentAssessmentDay,
	ListSubjectsAssessment,
	ChangeCourseStudentAssessmentLessonDay,
} from '../controller/assessment.js';

const upload = multer();
const router = express.Router();

router.get(
	'/courseStudentAssessment/:id',
	authenticateJWT,
	CourseStudentAssessmentDetails
);

router.get(
	'/fetchSubjectAssessment',
	authenticateJWT,
	ListSubjectsAssessment
);

router.get(
	'/courseStudentAssessmentDay',
	authenticateJWT,
	CourseStudentAssessmentDay
);

router.post(
	'/createCourseStudentAssessment',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateCourseStudentAssessment
);

router.put(
	'/updateCourseStudentAssessmentDay',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateCourseStudentAssessmentDay
);

router.put(
	'/changeCourseStudentAssessmentLessonDay',
	upload.none(),
	authenticateJWT,
	convertTypes,
	ChangeCourseStudentAssessmentLessonDay
);

export default router;

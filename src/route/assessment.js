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
	CourseStudentAssessmentData,
	CourseStudentAssessmentApprove,
	SaveSignatures,
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
	'/fetchAssessmentData',
	// authenticateJWT,
	CourseStudentAssessmentData
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

router.post(
	'/courseStudentAssessmentApprove',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CourseStudentAssessmentApprove
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
router.post(
	'/saveSignatures',
	upload.none(),
	authenticateJWT,
	convertTypes,
	SaveSignatures
);
export default router;

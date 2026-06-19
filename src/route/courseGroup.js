import express from 'express';
import multer from 'multer';
import convertTypes from '../middleware/convertTypes.js';
import {
	ListCourseGroups,
	CourseGroupDetails,
	CreateCourseGroup,
	UpdateCourseGroup,
	DeleteCourseGroup,
	ListCourseGroupStudents,
	SaveCourseGroupSignature,
	RemoveCourseStudentsFromGroup,
} from '../controller/courseGroup.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

router.get('/', authenticateJWT, ListCourseGroups);
router.get('/:id', authenticateJWT, CourseGroupDetails);
router.post(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateCourseGroup,
);
router.put(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateCourseGroup,
);
router.delete('/:id', authenticateJWT, DeleteCourseGroup);
router.get('/:id/students', authenticateJWT, ListCourseGroupStudents);
router.delete('/:id/students', authenticateJWT, RemoveCourseStudentsFromGroup);
router.post(
	'/signature',
	upload.none(),
	authenticateJWT,
	convertTypes,
	SaveCourseGroupSignature,
);

export default router;

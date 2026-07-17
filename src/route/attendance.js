import express from 'express';
import multer from 'multer';
import { authenticateJWT } from '../controller/authentication.js';
import convertTypes from '../middleware/convertTypes.js';
import {
	ListAttendance,
	GetAttendance,
	GetAttendanceByCourseStudent,
	GetAttendanceByDateRange,
	CreateAttendance,
	UpdateAttendance,
	DeleteAttendance,
	ListAttendanceStatuses,
	CreateAttendanceStatus,
	UpdateAttendanceStatus,
	DeleteAttendanceStatus,
	SaveAttendanceSignature,
	DeleteAttendanceSignature,
} from '../controller/attendance.js';

const upload = multer();
const router = express.Router();

router.get('/statuses', authenticateJWT, ListAttendanceStatuses);
router.get('/statuses/:id', authenticateJWT, ListAttendanceStatuses);
router.post(
	'/statuses',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateAttendanceStatus,
);
router.put(
	'/statuses/:id',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateAttendanceStatus,
);
router.delete('/statuses/:id', authenticateJWT, DeleteAttendanceStatus);

router.get('/', authenticateJWT, ListAttendance);
router.get('/by-course-student', authenticateJWT, GetAttendanceByCourseStudent);
router.get('/by-date-range', authenticateJWT, GetAttendanceByDateRange);
router.get('/:id', authenticateJWT, GetAttendance);
router.post('/', upload.none(), authenticateJWT, convertTypes, CreateAttendance);
router.put('/', upload.none(), authenticateJWT, convertTypes, UpdateAttendance);
router.delete('/:id', authenticateJWT, DeleteAttendance);
router.post('/signature', upload.none(), authenticateJWT, convertTypes, SaveAttendanceSignature);
router.delete('/:id/signature', authenticateJWT, DeleteAttendanceSignature);

export default router;

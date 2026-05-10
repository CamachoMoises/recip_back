import express from 'express';
import multer from 'multer';
import { SendEmailWithFile } from '../controller/email.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
	'/send',
	upload.any(),
	SendEmailWithFile,
);

export default router;
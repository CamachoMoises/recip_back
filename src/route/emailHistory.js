import express from 'express';
import multer from 'multer';
import {
	ListEmailHistories,
	CreateEmailHistory,
	DeleteEmailHistory,
} from '../controller/emailHistory.js';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

router.get('/', authenticateJWT, ListEmailHistories);
router.post('/', upload.none(), authenticateJWT, convertTypes, CreateEmailHistory);
router.delete('/:id', authenticateJWT, DeleteEmailHistory);

export default router;

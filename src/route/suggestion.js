import express from 'express';
import multer from 'multer';
import {
	CreateSuggestion,
	DeleteSuggestion,
	GetSuggestion,
	ListSuggestions,
	ListSuggestionsByUser,
	UpdateSuggestion,
} from '../controller/suggestion.js';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

router.get('/', authenticateJWT, ListSuggestions);
router.get('/:id', authenticateJWT, GetSuggestion);
router.get('/user/:user_id', authenticateJWT, ListSuggestionsByUser);
router.post(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateSuggestion,
);
router.put(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateSuggestion,
);
router.delete('/:id', authenticateJWT, DeleteSuggestion);

export default router;

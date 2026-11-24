import express from 'express';
import multer from 'multer';

import convertTypes from '../middleware/convertTypes.js';
import { requireSuperuser } from '../middleware/requireSuperuser.js';
import {
	authenticateJWT,
	ImpersonateUser,
	Login,
} from '../controller/authentication.js';

const upload = multer();
const router = express.Router();

router.post('/', upload.none(), convertTypes, Login);

// Solo administradores: genera un token de 1 h para ver el contenido como otro
// usuario, sin necesidad de conocer su contraseña.
router.post(
	'/impersonate/:user_id',
	authenticateJWT,
	requireSuperuser,
	ImpersonateUser,
);

export default router;

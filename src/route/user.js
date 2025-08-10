import express from 'express';
import multer from 'multer';
import {
	CreateUser,
	ListUsers,
	UpdateUser,
	CreateStudent,
	CreateInstructor,
	ListStudents,
	ListInstructors,
	ListUserDocType,
	UserData,
	UserValidateEmail,
} from '../controller/user.js';
import convertTypes from '../middleware/convertTypes.js';
import { authenticateJWT } from '../controller/authentication.js';
import { GetLoggedUser } from '../controller/user.js';
const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', authenticateJWT, ListUsers);
router.get('/user/:user_id', authenticateJWT, UserData);
router.get(
	'/userEmailValidate/:email',
	authenticateJWT,
	UserValidateEmail
);
router.get('/userDocType', authenticateJWT, ListUserDocType);
router.get('/student', authenticateJWT, ListStudents);
router.get('/instructor', authenticateJWT, ListInstructors);
router.post(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateUser
);
router.post(
	'/student',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateStudent
);
router.post(
	'/instructor',
	upload.none(),
	authenticateJWT,
	convertTypes,
	CreateInstructor
);
router.get('/me', authenticateJWT, GetLoggedUser);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.put(
	'/',
	upload.none(),
	authenticateJWT,
	convertTypes,
	UpdateUser
);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

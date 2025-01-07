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
const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListUsers);
router.get('/user/:user_id', UserData);
router.get('/userEmailValidate/:email', UserValidateEmail);
router.get('/userDocType', ListUserDocType);
router.get('/student', ListStudents);
router.get('/instructor', ListInstructors);
router.post('/', upload.none(), convertTypes, CreateUser);
router.post('/student', upload.none(), convertTypes, CreateStudent);
router.post(
	'/instructor',
	upload.none(),
	convertTypes,
	CreateInstructor
);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.put('/', upload.none(), convertTypes, UpdateUser);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

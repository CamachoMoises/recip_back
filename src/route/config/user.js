import express from 'express';
import multer from 'multer';
import {
	CreateUser,
	ListUsers,
	UpdateUser,
	CreateStudent,
	CreateInstructor,
} from '../../controller/user.js';
import convertTypes from '../../middleware/convertTypes.js';
const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListUsers);
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

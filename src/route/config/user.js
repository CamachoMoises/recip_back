import express from 'express';
import multer from 'multer';
import {
	CreateUser,
	ListUsers,
	UpdateUser,
} from '../../controller/user.js';
import convertTypes from '../../middleware/convertTypes.js';
const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListUsers);
router.post('/', upload.none(), convertTypes, CreateUser);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.put('/', upload.none(), convertTypes, UpdateUser);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

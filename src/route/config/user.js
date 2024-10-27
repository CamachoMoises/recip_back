import express from 'express';
import multer from 'multer';
import { Create, List } from '../../controller/user.js';
import convertTypes from '../../middleware/convertTypes.js';
const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', List);
router.post('/', upload.none(), convertTypes, Create);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
// router.put('/:id', usuarioController.actualizarUsuario);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

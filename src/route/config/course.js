import express from 'express';
// import multer from 'multer';
import { ListCourses } from '../../controller/course.js';

// const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListCourses);
// router.post('/', usuarioController.crearUsuario);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
// router.put('/:id', usuarioController.actualizarUsuario);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

import express from 'express';
// import multer from 'multer';
import {
	ListSubjects,
	ListSubjectsCourse,
} from '../../controller/subject.js';

// const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListSubjects);
// router.post('/', usuarioController.crearUsuario);
router.get('/course/:id', ListSubjectsCourse);
// router.put('/:id', usuarioController.actualizarUsuario);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

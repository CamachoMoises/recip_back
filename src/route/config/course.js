import express from 'express';
import multer from 'multer';
import convertTypes from '../../middleware/convertTypes.js';

// import multer from 'multer';
import {
	CreateCourse,
	ListCourses,
	ListCoursesTypes,
	UpdateCourse,
} from '../../controller/course.js';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', ListCourses);
router.get('/courseTypes', ListCoursesTypes);
router.post('/', upload.none(), convertTypes, CreateCourse);
router.put('/', upload.none(), convertTypes, UpdateCourse);

// router.post('/', usuarioController.crearUsuario);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
// router.put('/:id', usuarioController.actualizarUsuario);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

import express from 'express';
import multer from 'multer';
import { getAllSubjects } from '../../database/repositories/subject.js';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', async (req, res) => {
	try {
		const subject = await getAllSubjects();
		res.send(subject);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
});
// router.post('/', usuarioController.crearUsuario);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
// router.put('/:id', usuarioController.actualizarUsuario);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

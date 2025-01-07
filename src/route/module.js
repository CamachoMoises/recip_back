import express from 'express';
import multer from 'multer';
import { getAllModules } from '../database/repositories/module.js';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', async (req, res) => {
	try {
		const module = await getAllModules();
		res.send(module);
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

import express from 'express';
import multer from 'multer';
import { getAllRatings } from '../../database/repositories/rating.js';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', async (req, res) => {
	try {
		const rating = await getAllRatings();
		res.send(rating);
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

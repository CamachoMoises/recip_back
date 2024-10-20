import express from 'express';
import multer from 'multer';

const upload = multer();
const router = express.Router();

// Rutas para usuarios
router.get('/', async (req, res) => {
	res.send({ message: 'test pass' });
});
// router.post('/', usuarioController.crearUsuario);
// router.get('/:id', usuarioController.obtenerUsuarioPorId);
// router.put('/:id', usuarioController.actualizarUsuario);
// router.delete('/:id', usuarioController.eliminarUsuario);

export default router;

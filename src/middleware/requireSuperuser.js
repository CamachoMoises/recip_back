// middleware/requireSuperuser.js
import { getUserById } from '../database/repositories/user.js';

/**
 * Restringe una ruta a administradores (`user.is_superuser`).
 *
 * Debe montarse después de `authenticateJWT`, porque necesita `req.user.id`
 * (el JWT solo lleva el id del usuario). El front usa el mismo flag
 * (`auth.user.is_superuser`) para mostrar las acciones de administrador.
 */
export const requireSuperuser = async (req, res, next) => {
	try {
		const user = await getUserById(req.user?.id);
		if (!user.is_superuser) {
			return res.status(403).json({
				message: 'Se requiere rol de administrador',
			});
		}
		req.userRecord = user;
		next();
	} catch (error) {
		if (error.message === 'User not found') {
			return res.status(401).json({ message: 'Usuario no encontrado' });
		}
		console.error('Error validando permisos:', error.message);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export default requireSuperuser;

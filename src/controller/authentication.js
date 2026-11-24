import { getUserByEmail, getUserById } from '../database/repositories/user.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
// import { sequelize } from '../database/initDB.js';
dotenv.config();

//TODO: pass the secret key to env
const SECRET_KEY = 'your_secret_key';

export const Login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// RAW QUERY SEQUELIZE !!!!!!!!!!!!!!!!!!!!
		// const result = await sequelize.query(`SELECT * FROM user`);
		// console.log(result);
		const user = await getUserByEmail(email);
		if (!user) {
			throw new Error('invalid_user');
		}
		if (!user.is_active) {
			throw new Error('inactive_user');
		}
		const is_correct_password = bcrypt.compareSync(
			`${password}`,
			user.password,
		);
		if (!is_correct_password) {
			throw new Error('invalid_password');
		}
		const token = jwt.sign({ id: user.id }, SECRET_KEY, {
			expiresIn: '8h',
		});
		res.send({ email, user, token });
	} catch (error) {
		console.log(error.message);
		const message = error.message;
		switch (message) {
			case 'invalid_user':
				res.status(401).send('Invalid User');
				break;
			case 'invalid_password':
				res.status(401).send('Invalid Password');
				break;
			case 'inactive_user':
				res.status(401).send('User is inactive');
				break;

			default:
				res.status(500).send('Internal Server Error');
				break;
		}
	}
};

/*
 * Suplantación de usuario solo para administradores.
 *
 * El token resultante lleva el id del usuario suplantado (para que el resto de
 * la API siga funcionando sin cambios) más dos claims de auditoría:
 * `impersonated_by` (admin que lo generó) e `is_impersonation`. dura 1 h, menos
 * que una sesión normal (8 h), porque su único fin es inspeccionar contenido.
 *
 * La ruta debe montarse con `authenticateJWT` + `requireSuperuser`: el admin se
 * autentica con su token real y recibe un token nuevo para el usuario destino.
 * Los tokens ya emitidos no se revocan (JWT stateless).
 */
export const ImpersonateUser = async (req, res) => {
	try {
		const adminId = Number(req.user?.id);
		const targetId = Number(req.params.user_id);

		if (!Number.isInteger(targetId) || targetId <= 0) {
			return res.status(400).json({ message: 'ID de usuario inválido' });
		}
		if (targetId === adminId) {
			return res
				.status(400)
				.json({ message: 'No puedes suplantarte a ti mismo' });
		}

		const target = await getUserById(targetId); // lanza 'User not found'

		if (target.is_superuser) {
			return res.status(403).json({
				message: 'No se puede suplantar a un administrador',
			});
		}

		const token = jwt.sign(
			{
				id: target.id,
				impersonated_by: adminId,
				is_impersonation: true,
			},
			SECRET_KEY,
			{ expiresIn: '1h' },
		);

		// Auditoría: quién suplantó a quién y cuándo. No guarda el token.
		console.warn(
			JSON.stringify({
				event: 'user_impersonation',
				admin_id: adminId,
				target_user_id: target.id,
				timestamp: new Date().toISOString(),
			}),
		);

		const safeUser = target.toJSON();
		delete safeUser.password;
		return res.json({
			email: target.email,
			user: safeUser,
			token,
			impersonated_by: adminId,
			expires_in: '1h',
		});
	} catch (error) {
		if (error.message === 'User not found') {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		console.error('Error al suplantar usuario:', error.message);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const authenticateJWT = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (token) {
		jwt.verify(token, SECRET_KEY, (err, user) => {
			if (err) {
				return res.status(403).send(JSON.stringify(err));
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401).send('Unauthorized');
	}
};

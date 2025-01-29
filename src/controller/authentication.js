import { getUserByEmail } from '../database/repositories/user.js';
import bcrypt from 'bcrypt';
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
		const is_correct_password = bcrypt.compareSync(
			`${password}`,
			user.password
		);
		if (!is_correct_password) {
			throw new Error('invalid_password');
		}
		const token = jwt.sign({ id: user.id }, SECRET_KEY, {
			expiresIn: '1h',
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

			default:
				res.status(500).send('Internal Server Error');
				break;
		}
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

import { createUserSchema } from '../database/imput_validation/user.js';
import {
	createUser,
	getAllUsers,
} from '../database/repositories/user.js';
export const List = async (req, res) => {
	try {
		const user = await getAllUsers();
		res.send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const Create = async (req, res) => {
	const { error, value } = createUserSchema.validate(req.body);
	console.log(value, error);

	if (error) {
		console.log();
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
	const {
		name,
		doc_number,
		last_name,
		phone,
		email,
		is_active,
		is_staff,
		is_superuser,
		password,
	} = value;

	try {
		const user = await createUser({
			name,
			doc_number,
			last_name,
			phone,
			email,
			is_active,
			is_staff,
			is_superuser,
			password,
		});
		res.status(201).send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

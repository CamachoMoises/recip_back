import {
	createUserSchema,
	updateUserSchema,
} from '../database/imput_validation/user.js';
import {
	createUser,
	editUser,
	getAllUsers,
	getUserByUUID,
} from '../database/repositories/user.js';
export const ListUsers = async (req, res) => {
	try {
		const user = await getAllUsers();
		res.send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateUser = async (req, res) => {
	const { error, value } = createUserSchema.validate(req.body);
	console.log(value, error);

	if (error) {
		console.log(error.message);
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
export const UpdateUser = async (req, res) => {
	const { error, value } = updateUserSchema.validate(req.body);
	if (error) {
		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
	const {
		id,
		uuid,
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
		const userEdit = await editUser({
			id,
			uuid,
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
		if (userEdit) {
			res.status(201).send(userEdit);
		} else {
			res.status(404).send('User not found');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

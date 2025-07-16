import {
	createUserSchema,
	updateUserSchema,
} from '../database/imput_validation/user.js';
import {
	createUser,
	editUser,
	getAllUserDocType,
	getAllUsers,
	getInstructorByUserId,
	getStudentByUserId,
	getUserByEmail,
	getUserById,
	getUserByUUID,
	getUsersInstructors,
	getUsersStudents,
} from '../database/repositories/user.js';
import { stringToBoolean } from './utilities.js';

export const ListUsers = async (req, res) => {
	try {
		const users = await getAllUsers();

		res.send(users);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UserData = async (req, res) => {
	const user_id = req.params.user_id;
	try {
		const user = await getUserById(user_id);
		res.send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UserValidateEmail = async (req, res) => {
	const email = req.params.email;
	try {
		const user = await getUserByEmail(email);
		const exist = user ? true : false;
		res.send({ exist });
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListUserDocType = async (req, res) => {
	try {
		const courses = await getAllUserDocType();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const ListStudents = async (req, res) => {
	try {
		let { status } = req.query;
		if (status) {
			status = stringToBoolean(status);
		}
		const students = await getUsersStudents(status);

		res.send(students);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListInstructors = async (req, res) => {
	try {
		let { status } = req.query;
		if (status) {
			status = stringToBoolean(status);
		}
		const instructors = await getUsersInstructors(status);

		res.send(instructors);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateUser = async (req, res) => {
	const data = req.body;
	delete data.student;
	delete data.instructor;
	const { error, value } = createUserSchema.validate(data);

	if (error) {
		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}

	const {
		name,
		country_name,
		flag,
		doc_number,
		user_doc_type_id,
		last_name,
		phone,
		email,
		is_active,
		is_staff,
		is_superuser,
		password,
	} = value;
	try {
		const passwordUnHash = password;
		const user = await createUser({
			name,
			country_name,
			flag,
			doc_number,
			user_doc_type_id,
			last_name,
			phone,
			email,
			is_active,
			is_staff,
			is_superuser,
			passwordUnHash,
		});
		res.status(201).send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const UpdateUser = async (req, res) => {
	const data = req.body;
	delete data.student;
	delete data.instructor;
	console.log(data);
	const { error, value } = updateUserSchema.validate(data);
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
		country_name,
		flag,
		doc_number,
		user_doc_type_id,
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
			country_name,
			flag,
			doc_number,
			user_doc_type_id,
			last_name,
			phone,
			email,
			is_active,
			is_staff,
			is_superuser,
			password,
		});
		if (userEdit) {
			const edited_user = await getUserByUUID({ uuid });
			res.status(201).send(edited_user);
		} else {
			res.status(404).send('User not found');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateStudent = async (req, res) => {
	const data = req.body;
	try {
		await getStudentByUserId(data.user_id);
		const user = await getUserById(data.user_id);
		res.status(201).send(user);
	} catch (error) {
		console.error('Error en la validación:', error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};
export const CreateInstructor = async (req, res) => {
	const data = req.body;
	try {
		await getInstructorByUserId(data.user_id);
		const user = await getUserById(data.user_id);
		res.status(201).send(user);
	} catch (error) {
		console.error('Error en la validación:', error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

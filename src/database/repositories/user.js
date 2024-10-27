import { models } from '../initDB.js';

const { User } = models;

const getAllUsers = async () => User.findAll();
const getUserByUUID = async ({ uuid }) =>
	User.findOne({
		where: { uuid },
	});

const createUser = async ({
	name,
	doc_number,
	last_name,
	phone,
	email,
	is_active,
	is_staff,
	is_superuser,
	password,
}) =>
	User.create({
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
const editUser = async ({
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
}) => {
	const user = await User.findOne({
		where: { uuid: uuid },
	});
	if (user) {
		user.name = name;
		user.doc_number = doc_number;
		user.last_name = last_name;
		user.phone = phone;
		user.email = email;
		user.is_active = is_active;
		user.is_staff = is_staff;
		user.is_superuser = is_superuser;
		if (password) user.password = password;
		await user.save();
		return user;
	} else {
		return null;
	}
};

export { getAllUsers, getUserByUUID, createUser, editUser };

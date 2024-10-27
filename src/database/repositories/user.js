import { models } from '../initDB.js';

const { User } = models;

const getAllUsers = async () => User.findAll();

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

export { getAllUsers, createUser };

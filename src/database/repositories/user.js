import { models } from '../initDB.js';

const { User, Student, Instructor, UserDocType } = models;

const getAllUsers = async () =>
	User.findAll({
		include: [
			{
				model: Student,
			},
			{
				model: Instructor,
			},
			{
				model: UserDocType,
			},
		],
	});
const getUserByUUID = async ({ uuid }) =>
	User.findOne({
		where: { uuid },
		include: [
			{
				model: Student,
			},
			{
				model: Instructor,
			},
			{
				model: UserDocType,
			},
		],
	});
const getAllUserDocType = async () => UserDocType.findAll();

const getStudentByUserId = async (user_id) => {
	const user = await User.findByPk(user_id);
	if (!user) throw new Error('User not found');
	const student = await user.getStudent();
	console.log(student);
	if (!student) {
		console.log('Ojo');
		const status = user.is_active;
		return await user.createStudent({ status });
	} else {
		return student;
	}
};

const getInstructorByUserId = async (user_id) => {
	const user = await User.findByPk(user_id);
	if (!user) throw new Error('User not found');
	const instructor = await user.getInstructor();
	console.log(instructor);
	if (!instructor) {
		console.log('Ojo');
		const status = user.is_active;
		return await user.createInstructor({ status });
	} else {
		return instructor;
	}
};
const getUserById = async (id) => {
	const user = await User.findByPk(id, {
		include: [
			{
				model: Student,
			},
			{
				model: Instructor,
			},
			{
				model: UserDocType,
			},
		],
	});
	if (!user) throw new Error('User not found');
	return user;
};
const createUser = async ({
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
}) =>
	User.create({
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
const editUser = async ({
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
}) => {
	const user = await User.findOne({
		where: { uuid: uuid },
	});
	if (user && id) {
		user.name = name;
		user.country_name = country_name;
		user.flag = flag;
		user.doc_number = doc_number;
		user.last_name = last_name;
		user.user_doc_type_id = user_doc_type_id;
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
const getUsersStudents = async () => {
	const students = await User.findAll({
		include: [
			{
				model: Student,
				required: true,
			},
			{
				model: UserDocType,
			},
		],
	});
	return students;
};

const getUsersInstructors = async () => {
	const instructor = await User.findAll({
		include: [
			{
				model: Instructor,
				required: true,
			},
			{
				model: UserDocType,
			},
		],
	});
	return instructor;
};

export {
	getAllUsers,
	getUsersStudents,
	getUsersInstructors,
	getAllUserDocType,
	getUserByUUID,
	createUser,
	editUser,
	getUserById,
	getStudentByUserId,
	getInstructorByUserId,
};

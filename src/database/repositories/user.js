import { hashPassword } from '../../controller/utilities.js';
import { models } from '../index.js';
import { Op } from 'sequelize';

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
	if (!student) {
		return await user.createStudent({ status: user.is_active });
	}
	// Idempotente para POST /api/users/student: si el rol existe pero está
	// desactivado, lo reactiva. No toca User.is_active.
	if (!student.status) {
		student.status = true;
		await student.save();
	}
	return student;
};

const getInstructorByUserId = async (user_id) => {
	const user = await User.findByPk(user_id);
	if (!user) throw new Error('User not found');
	const instructor = await user.getInstructor();
	if (!instructor) {
		return await user.createInstructor({ status: user.is_active });
	}
	if (!instructor.status) {
		instructor.status = true;
		await instructor.save();
	}
	return instructor;
};

const removeStudentByUserId = async (user_id) => {
	const user = await User.findByPk(user_id);
	if (!user) throw new Error('User not found');
	const student = await user.getStudent();
	if (student) {
		student.status = false;
		await student.save();
	}
};

const removeInstructorByUserId = async (user_id) => {
	const user = await User.findByPk(user_id);
	if (!user) throw new Error('User not found');
	const instructor = await user.getInstructor();
	if (instructor) {
		instructor.status = false;
		await instructor.save();
	}
};

const updateInstructorStatus = async (userId, status) => {
	const user = await User.findByPk(userId);
	if (!user) throw new Error('User not found');
	const instructor = await user.getInstructor();
	if (!instructor) throw new Error('Instructor not found');
	instructor.status = status;
	await instructor.save();
	return instructor;
};

const roleInactiveError = (message) => {
	const error = new Error(message);
	error.status = 409;
	return error;
};

/*
 * Guards para escrituras/asignaciones nuevas. No se usan para ocultar historial:
 * desactivar un rol impide nuevas asignaciones, pero conserva registros previos.
 * Se valida por id de rol (Student.id / Instructor.id), que es lo que guardan
 * schedule.instructor_id, course_student.student_id, etc.
 */
const assertStudentRoleActiveById = async (studentId) => {
	if (studentId === undefined || studentId === null || studentId === '') {
		return null;
	}
	const id = Number(studentId);
	if (!Number.isInteger(id) || id <= 0) {
		const error = new Error('ID de alumno inválido');
		error.status = 400;
		throw error;
	}
	const student = await Student.findByPk(id, { include: [{ model: User }] });
	if (!student) {
		const error = new Error('Alumno no encontrado');
		error.status = 404;
		throw error;
	}
	if (!student.status || !student.user?.is_active) {
		throw roleInactiveError(
			'El alumno no está activo; reactiva su rol antes de asignarlo',
		);
	}
	return student;
};

const assertInstructorRoleActiveById = async (instructorId) => {
	if (instructorId === undefined || instructorId === null || instructorId === '') {
		return null;
	}
	const id = Number(instructorId);
	if (!Number.isInteger(id) || id <= 0) {
		const error = new Error('ID de instructor inválido');
		error.status = 400;
		throw error;
	}
	const instructor = await Instructor.findByPk(id, {
		include: [{ model: User }],
	});
	if (!instructor) {
		const error = new Error('Instructor no encontrado');
		error.status = 404;
		throw error;
	}
	if (!instructor.status || !instructor.user?.is_active) {
		throw roleInactiveError(
			'El instructor no está activo; reactiva su rol antes de asignarlo',
		);
	}
	return instructor;
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
const getUserByEmail = async (email) => {
	const user = await User.findOne({
		where: { email },
		include: [
			{
				model: Student,
			},
			{
				model: Instructor,
			},
		],
	});
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
	rank,
	is_active,
	is_staff,
	is_superuser,
	passwordUnHash,
}) => {
	const password = hashPassword(`${passwordUnHash}`);
	const user = User.create({
		name,
		country_name,
		flag,
		doc_number,
		user_doc_type_id,
		last_name,
		phone,
		email,
		rank,
		is_active,
		is_staff,
		is_superuser,
		password,
	});
	return user;
};
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
	rank,
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
		user.rank = rank;
		user.is_active = is_active;
		user.is_staff = is_staff;
		user.is_superuser = is_superuser;
		// El front reenvía el usuario completo del GET, incluido `password` con el
		// hash actual. Solo rehashear si es un valor nuevo: si se rehashea el hash
		// guardado, el usuario deja de poder iniciar sesión.
		if (password && password !== user.password) {
			user.password = hashPassword(`${password}`);
		}
		await user.save();

		if (is_active !== undefined) {
			const student = await user.getStudent();
			if (student) {
				student.status = is_active;
				await student.save();
			}
			const instructor = await user.getInstructor();
			if (instructor) {
				instructor.status = is_active;
				await instructor.save();
			}
		}

		return user;
	} else {
		return null;
	}
};
const getUsersStudents = async (status) => {
	const whereCondition = {};
	const whereStudentCondition = {};
	if (status !== undefined) {
		whereCondition.is_active = status;
		whereStudentCondition.status = status;
	}
	const students = await User.findAll({
		where: whereCondition,
		include: [
			{
				where: whereStudentCondition,
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

const getUsersInstructors = async (status) => {
	const whereCondition = {};
	const whereInstructorCondition = {};

	if (status !== undefined) {
		whereCondition.is_active = status;
		whereInstructorCondition.status = status;
	}

	const instructors = await User.findAll({
		where: whereCondition,
		include: [
			{
				where: whereInstructorCondition,
				model: Instructor,
				required: true,
			},
			{
				model: UserDocType,
			},
		],
	});
	return instructors;
};
// repositories/user.js

const searchStudents = async (query, options = {}) => {
	const includeInactive =
		options.include_inactive === true ||
		options.include_inactive === 1 ||
		options.include_inactive === 'true' ||
		options.include_inactive === '1';

	const searchPattern = `%${query}%`;
	const studentWhere = includeInactive ? {} : { status: true };
	const userWhere = {
		[Op.or]: [
			{ name: { [Op.like]: searchPattern } },
			{ last_name: { [Op.like]: searchPattern } },
			{ email: { [Op.like]: searchPattern } },
		],
	};
	if (!includeInactive) {
		userWhere.is_active = true;
	}

	const users = await User.findAll({
		where: userWhere,
		include: [
			{
				model: Student,
				required: true,
				...(includeInactive ? {} : { where: studentWhere }),
			},
			{
				model: UserDocType,
			},
		],
	});

	return users.map((user) => ({
		student_id: user.student.id,
		name: `${user.name} ${user.last_name}`.trim(),
		email: user.email,
	}));
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
	getUserByEmail,
	getStudentByUserId,
	getInstructorByUserId,
	removeStudentByUserId,
	removeInstructorByUserId,
	updateInstructorStatus,
	assertStudentRoleActiveById,
	assertInstructorRoleActiveById,
	searchStudents,
};

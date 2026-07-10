import { Op } from 'sequelize';
import { models } from '../index.js';

const {
	CourseGroup,
	Course,
	CourseType,
	CourseLevel,
	CourseStudent,
	CourseGroupSignature,
	Student,
	User,
} = models;

const getAllCourseGroups = async (filters) => {
	const whereClause = {};
	if (filters.title) {
		whereClause.title = { [Op.like]: `%${filters.title}%` };
	}
	if (filters.course_id) {
		whereClause.course_id = filters.course_id;
	}
	if (filters.user_code) {
		whereClause.user_code = { [Op.like]: `%${filters.user_code}%` };
	}
	if (filters.status !== undefined) {
		whereClause.status = filters.status === 'true' ? true : false;
	}

	const pageSize = parseInt(filters.pageSize) || 10;
	const currentPage = parseInt(filters.currentPage) || 1;
	const offset = (currentPage - 1) * pageSize;

	const result = await CourseGroup.findAndCountAll({
		where: whereClause,
		include: [
			{
				model: Course,
				include: [CourseType, CourseLevel],
			},
		],
		order: [['createdAt', 'DESC']],
		limit: pageSize,
		offset: offset,
	});

	return {
		data: result.rows,
		totalItems: result.count,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: Math.ceil(result.count / pageSize),
	};
};

const getCourseGroupById = async (id) =>
	await CourseGroup.findOne({
		where: { id },
		include: [
			{
				model: Course,
				include: [{ model: CourseStudent }],
			},
			{
				model: CourseGroupSignature,
			},
		],
	});

const createCourseGroup = async ({
	title,
	user_code,
	date,
	course_id,
	status,
}) => {
	let numberCode = 1;
	const prevCourseGroup = await CourseGroup.findOne({
		order: [['createdAt', 'DESC']],
	});
	if (prevCourseGroup) {
		numberCode = prevCourseGroup.id + 1;
	}
	const stringCode = String(numberCode).padStart(8, '0');
	const code = `CG-${stringCode}`;

	const newCourseGroup = await CourseGroup.create({
		title,
		code,
		user_code: user_code || null,
		date: date || null,
		course_id: course_id || null,
		status: status !== undefined ? status : true,
	});
	return newCourseGroup;
};

const editCourseGroup = async ({
	id,
	title,
	user_code,
	date,
	status,
}) => {
	const courseGroup = await CourseGroup.findByPk(id);
	if (!courseGroup) {
		throw new Error('CourseGroup not found');
	}
	await courseGroup.update({
		title: title !== undefined ? title : courseGroup.title,
		user_code:
			user_code !== undefined ? user_code : courseGroup.user_code,
		date: date !== undefined ? date : courseGroup.date,
		status: status !== undefined ? status : courseGroup.status,
	});
	return courseGroup;
};

const deleteCourseGroup = async (id) => {
	const courseGroup = await CourseGroup.findByPk(id);
	if (!courseGroup) {
		throw new Error('CourseGroup not found');
	}
	await courseGroup.destroy();
	return courseGroup;
};

const getCourseStudentsByGroupId = async (id, filters) => {
	const pageSize = parseInt(filters?.pageSize) || 10;
	const currentPage = parseInt(filters?.currentPage) || 1;
	const offset = (currentPage - 1) * pageSize;

	const result = await CourseStudent.findAndCountAll({
		where: { course_group_id: id },
		include: [
			{ model: Student, include: [{ model: User }] },
			{ model: Course },
		],
		order: [['createdAt', 'DESC']],
		limit: pageSize,
		offset: offset,
	});

	return {
		data: result.rows,
		totalItems: result.count,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: Math.ceil(result.count / pageSize),
	};
};

const removeCourseStudentsFromGroup = async (
	groupId,
	courseStudentIds,
) => {
	const group = await CourseGroup.findByPk(groupId);
	if (!group) {
		throw new Error('CourseGroup not found');
	}
	const [affectedCount] = await CourseStudent.update(
		{ course_group_id: null },
		{ where: { id: courseStudentIds } },
	);
	return affectedCount;
};

export {
	getAllCourseGroups,
	getCourseGroupById,
	createCourseGroup,
	editCourseGroup,
	deleteCourseGroup,
	getCourseStudentsByGroupId,
	removeCourseStudentsFromGroup,
};

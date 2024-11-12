import { models } from '../initDB.js';

const { Course, CourseType } = models;

const getAllCourses = async () =>
	Course.findAll({
		include: [CourseType],
	});

const getAllCoursesTypes = async () => CourseType.findAll();

const getCourseById = async (id) =>
	Course.findOne({ where: { id: id }, include: [CourseType] });

const getCourseTypeById = async (id) =>
	CourseType.findOne({ where: { id: id } });

const createCourse = async ({
	name,
	description,
	hours,
	days,
	course_type_id,
	status,
}) =>
	Course.create({
		name,
		description,
		hours,
		days,
		course_type_id,
		status,
	});

const editCourse = async ({
	id,
	name,
	description,
	hours,
	days,
	course_type_id,
	status,
}) => {
	const course = await Course.findByPk(id);
	if (!course) {
		throw new Error('Course not found');
	}
	await course.update({
		name,
		description,
		hours,
		days,
		course_type_id,
		status,
	});
	return course;
};
export {
	getAllCourses,
	getAllCoursesTypes,
	getCourseById,
	getCourseTypeById,
	createCourse,
	editCourse,
};

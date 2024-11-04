import { models } from '../initDB.js';

const { Course, CourseType } = models;

const getAllCourses = async () =>
	Course.findAll({
		include: [CourseType],
	});

const getAllCoursesTypes = async () => CourseType.findAll();

const getCourseById = async (value) =>
	Course.findOne({ where: { id: value }, include: [CourseType] });

const getCourseTypeById = async (value) =>
	CourseType.findOne({ where: { id: value } });

const createCourse = async ({
	name,
	description,
	hours,
	course_type_id,
	status,
}) =>
	Course.create({ name, description, hours, course_type_id, status });

export {
	getAllCourses,
	getAllCoursesTypes,
	getCourseById,
	getCourseTypeById,
	createCourse,
};

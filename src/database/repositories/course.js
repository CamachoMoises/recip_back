import { models } from '../initDB.js';

const { Course, CourseType, CourseStudent } = models;

const getAllCourses = async () =>
	Course.findAll({
		include: [CourseType],
	});

const getAllCoursesTypes = async () => CourseType.findAll();

const getCourseStudentById = async (id) =>
	CourseStudent.findOne({ where: { id: id } });

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

const createCourseStudent = async (course_id) => {
	let numberCode = 0;
	const prevCourseStudent = await CourseStudent.findOne({
		order: [['createdAt', 'DESC']],
	});
	console.log(prevCourseStudent);
	if (prevCourseStudent) {
		numberCode = prevCourseStudent.id + 1;
	}
	const stringCode = String(numberCode).padStart(8, '0');
	const code = `CS-${stringCode}`;
	const newCourseStudent = CourseStudent.create({
		course_id,
		code,
	});
	return newCourseStudent;
};

const editCourseStudent = async (course_id, date, student_id) => {
	const course = await Course.findByPk(course_id);
	if (!course) {
		throw new Error('Course not found');
	}
	await CourseStudent.update({
		date,
		student_id,
	});
	return course;
};

export {
	getAllCourses,
	getAllCoursesTypes,
	getCourseById,
	getCourseTypeById,
	getCourseStudentById,
	createCourse,
	editCourse,
	editCourseStudent,
	createCourseStudent,
};

import { models } from '../initDB.js';

const {
	Course,
	CourseType,
	CourseLevel,
	CourseStudent,
	Student,
	User,
	Schedule,
} = models;

const getAllCourses = async () =>
	Course.findAll({
		include: [CourseType, CourseLevel],
	});

const getAllCoursesStudent = async () =>
	CourseStudent.findAll({
		include: [
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: Course,
				include: [CourseType, CourseLevel],
			},
		],
		order: [['createdAt', 'DESC']],
	});

const getAllCoursesTypes = async () => CourseType.findAll();
const getAllCoursesLevel = async () => CourseLevel.findAll();

const getCourseStudentById = async (id) =>
	CourseStudent.findOne({ where: { id: id }, include: [Student] });

const getCourseById = async (id) =>
	Course.findOne({
		where: { id: id },
		include: [CourseType, CourseLevel],
	});

const getCourseTypeById = async (id) =>
	CourseType.findOne({ where: { id: id } });

const getCourseLevelById = async (id) =>
	CourseType.findOne({ where: { id: id } });

const createCourse = async ({
	name,
	description,
	// hours,
	days,
	course_type_id,
	course_level_id,
	status,
}) =>
	Course.create({
		name,
		description,
		// hours,
		days,
		course_type_id,
		course_level_id,
		status,
	});

const editCourse = async ({
	id,
	name,
	description,
	// hours,
	days,
	course_type_id,
	course_level_id,
	status,
}) => {
	const course = await Course.findByPk(id);
	if (!course) {
		throw new Error('Course not found');
	}
	await course.update({
		name,
		description,
		// hours,
		days,
		course_type_id,
		course_level_id,
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

const editCourseStudent = async (
	course_id,
	course_student_id,
	date,
	student_id,
	typeTrip,
	license,
	regulation
) => {
	const courseStudent = await CourseStudent.findByPk(
		course_student_id
	);
	if (!courseStudent) {
		throw new Error('Course not found');
	}
	const type_trip = typeTrip;
	const new_date = date ? date : null;

	await courseStudent.update({
		date: new_date,
		student_id: student_id,
		type_trip: type_trip,
		license: license,
		regulation: regulation,
	});
	return courseStudent;
};

const getAllSchedule = async (id) => {
	const data = await Schedule.findAll({
		where: {
			course_student_id: id,
		},
	});
	return data;
};

const createSchedule = async (
	instructor_id,
	course_id,
	subject_days_id,
	student_id,
	subject_days_subject_id,
	course_student_id,
	date,
	hour,
	classTime
) => {
	const newSchedule = await Schedule.create({
		instructor_id,
		course_id,
		subject_days_id,
		student_id,
		subject_days_subject_id,
		course_student_id,
		date,
		hour,
		classTime,
	});
	return newSchedule;
};
const updateSchedule = async (
	id,
	instructor_id,
	date,
	hour,
	classTime
) => {
	const editSchedule = await Schedule.findByPk(id);
	if (!editSchedule) {
		throw new Error('Course not found');
	}
	editSchedule.update({
		instructor_id,
		date,
		hour,
		classTime,
	});
	return editSchedule;
};

export {
	getAllCourses,
	getAllCoursesStudent,
	getAllCoursesTypes,
	getAllCoursesLevel,
	getCourseById,
	getCourseTypeById,
	getCourseLevelById,
	getCourseStudentById,
	createCourse,
	editCourse,
	editCourseStudent,
	createCourseStudent,
	getAllSchedule,
	createSchedule,
	updateSchedule,
};

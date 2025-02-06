import { Op } from 'sequelize';
import { models } from '../initDB.js';

const {
	Course,
	CourseType,
	CourseLevel,
	CourseStudent,
	CourseStudentTest,
	CourseStudentAssessment,
	SubjectDays,
	Subject,
	Student,
	Test,
	Instructor,
	User,
	Schedule,
} = models;

const getAllCourses = async (filters) => {
	const whereClause = {};
	if (filters.name) {
		whereClause.name = { [Op.like]: `%${filters.name}%` };
	}
	if (filters.description) {
		whereClause.description = {
			[Op.like]: `%${filters.description}%`,
		};
	}
	if (filters.course_type_id) {
		whereClause.course_type_id = filters.course_type_id;
	}
	if (filters.course_level_id) {
		whereClause.course_level_id = filters.course_level_id;
	}
	const data = Course.findAll({
		include: [CourseType, CourseLevel],
		where: whereClause,
	});
	return data;
};

const getAllCoursesStudent = async (filters) => {
	const whereClause = {};
	if (filters.course_type_id) {
		whereClause.id = filters.course_type_id;
	}
	const courseStudent = CourseStudent.findAll({
		include: [
			{
				model: Student,
				required: 'id' in whereClause ? true : false,

				include: [{ model: User }],
			},
			{
				model: Course,
				required: true,
				include: [
					{
						model: CourseType,
						where: whereClause,
						required: true,
					},
					{
						model: CourseLevel,
					},
				],
			},
			{
				model: CourseStudentTest,
			},
			{
				model: CourseStudentAssessment,
			},
			{
				model: Schedule,
				include: [
					{
						model: Subject,
						where: {
							name: {
								[Op.like]: `%examen%`, // Buscar valores que contengan "examen"
							},
						},
					},
					{
						model: Instructor,
						include: [{ model: User }],
					},
				],
			},
		],
		order: [['createdAt', 'DESC']],
	});

	return courseStudent;
};

const getAllCoursesTypes = async () => CourseType.findAll();
const getAllCoursesLevel = async () => CourseLevel.findAll();

const getCourseStudentById = async (id) =>
	await CourseStudent.findOne({
		where: { id: id },
		include: [
			{
				model: Student,
			},
			{
				model: Course,
				include: [CourseType, CourseLevel, Test],
			},
			{
				model: CourseStudentTest,
			},
			{
				model: Schedule,
				include: [
					{
						model: Subject,
						where: {
							name: {
								[Op.like]: `%examen%`,
							},
						},
					},
				],
			},
		],
	});

const getCourseById = async (id) =>
	await Course.findOne({
		where: { id: id },
		include: [CourseType, CourseLevel],
	});

const getCourseTypeById = async (id) =>
	await CourseType.findOne({ where: { id: id } });

const getCourseLevelById = async (id) =>
	await CourseType.findOne({ where: { id: id } });

const createCourse = async ({
	name,
	description,
	// hours,
	days,
	course_type_id,
	course_level_id,
	plane_model,
	status,
}) =>
	await Course.create({
		name,
		description,
		// hours,
		days,
		plane_model,
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
	plane_model,
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
		plane_model,
		status,
	});
	return course;
};
const updateCourseHours = async (id, hours) => {
	const course = await Course.findByPk(id);
	if (!course) {
		throw new Error('Course not found');
	}
	await course.update({
		id,
		hours,
	});
};

const createCourseStudent = async (course_id) => {
	let numberCode = 1;
	const prevCourseStudent = await CourseStudent.findOne({
		order: [['createdAt', 'DESC']],
	});
	if (prevCourseStudent) {
		numberCode = prevCourseStudent.id + 1;
	}
	const stringCode = String(numberCode).padStart(8, '0');
	const code = `CS-${stringCode}`;
	const newCourseStudent = await CourseStudent.create({
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
const getScheduleById = async (id) => {
	const schedule = await Schedule.findOne({
		where: {
			id: id,
		},
		include: [
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: Instructor,
				include: [{ model: User }],
			},
			{
				model: CourseStudent,
			},
			{
				model: CourseStudent,
			},
			{
				model: SubjectDays,
			},
			{
				model: Subject,
			},
		],
	});

	return schedule;
};

const getAllSchedule = async (id) => {
	const data = await Schedule.findAll({
		where: {
			course_student_id: id,
		},
		include: [
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: Instructor,
				include: [{ model: User }],
			},
			{
				model: CourseStudent,
			},
			{
				model: CourseStudent,
			},
			{
				model: SubjectDays,
			},
			{
				model: Subject,
			},
		],
		order: [
			['date', 'ASC'], // Ordenar por fecha en forma ascendente
			['hour', 'ASC'], // Ordenar por hora en forma ascendente
		],
	});
	return data;
};

const createSchedule = async (
	instructor_id,
	course_id,
	subject_days_id,
	student_id,
	subject_id,
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
		subject_id,
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
	await editSchedule.update({
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
	updateCourseHours,
	editCourseStudent,
	createCourseStudent,
	getAllSchedule,
	getScheduleById,
	createSchedule,
	updateSchedule,
};

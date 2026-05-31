import { Op, Sequelize } from 'sequelize';
import { models } from '../index.js';

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
	const courseStudentWhere = {};
	if (filters.status !== undefined && filters.status !== '') {
		courseStudentWhere.status =
			filters.status === 'true' ? true : false;
	}
	// Calculamos el offset basado en currentPage y pageSize
	const pageSize = parseInt(filters.pageSize) || 10; // Valor por defecto 10
	const currentPage = parseInt(filters.currentPage) || 1; // Valor por defecto 1
	const offset = (currentPage - 1) * pageSize;

	const courseStudent = await CourseStudent.findAndCountAll({
		distinct: true,
		col: 'id',
		where: courseStudentWhere,
		attributes: {
			include: [
				[
					Sequelize.literal(`(
                    SELECT MAX(cst.score)
                    FROM course_student_test AS cst
                    WHERE cst.course_student_id = course_student.id
                )`),
					'highest_score',
				],
			],
		},
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
				where: {
					course_student_id: {
						[Op.eq]: Sequelize.col('course_student.id'),
					},
				},
				required: false,
			},
			{
				model: CourseStudentAssessment,
				where: {
					course_student_id: {
						[Op.eq]: Sequelize.col('course_student.id'),
					},
				},
				required: false,
			},
			{
				model: Schedule,
				include: [
					{
						model: Subject,
						where:
							whereClause.id == 1
								? {
										name: { [Op.like]: `%examen%` },
									}
								: {},
						required: whereClause.id == 1,
					},
					{
						model: Instructor,
						include: [{ model: User }],
					},
				],
			},
		],
		order: [['createdAt', 'DESC']],
		limit: pageSize,
		offset: offset,
	});
	return {
		data: courseStudent.rows,
		totalItems: courseStudent.count,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: Math.ceil(courseStudent.count / pageSize),
	};
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
	code,
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
		code,
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
	code,
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
		code,
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
	const code = `CP-${stringCode}`;
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
	regulation,
	instructorCode,
) => {
	const courseStudent =
		await CourseStudent.findByPk(course_student_id);
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
		instructor_code: instructorCode ?? null,
	});
	return courseStudent;
};

const updateCourseStudentStatus = async (
	course_student_id,
	status,
) => {
	const courseStudent =
		await CourseStudent.findByPk(course_student_id);
	if (!courseStudent) {
		throw new Error('CourseStudent not found');
	}
	await courseStudent.update({
		status,
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
	classTime,
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
	classTime,
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

const updateCourseStudentMaxAttempts = async (id, max_attempts) => {
	const record = await CourseStudent.findByPk(id);
	if (!record) {
		throw new Error('CourseStudent not found');
	}
	record.max_attempts = max_attempts;
	await record.save();
	return record;
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
	updateCourseStudentStatus,
	createCourseStudent,
	getAllSchedule,
	getScheduleById,
	createSchedule,
	updateSchedule,
	updateCourseStudentMaxAttempts,
};

import { Op, Sequelize } from 'sequelize';
import { models, sequelize } from '../index.js';
import { getCourseStudentIdsByInstructor } from './instructor.js';

const {
	Course,
	CourseType,
	CourseLevel,
	CourseStudent,
	CourseStudentTest,
	CourseStudentAssessment,
	CourseGroup,
	SubjectDays,
	Subject,
	Student,
	Test,
	Instructor,
	User,
	Schedule,
	Attendance,
	AttendanceSignature,
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
	if (filters.course_group_id) {
		courseStudentWhere.course_group_id = filters.course_group_id;
	}
	if (filters.course_id) {
		courseStudentWhere.course_id = filters.course_id;
	}
	if (filters.student_id) {
		courseStudentWhere.student_id = filters.student_id;
	}
	if (filters.instructor_id) {
		const csIds = await getCourseStudentIdsByInstructor(
			filters.instructor_id,
		);
		if (csIds.length === 0) {
			return {
				data: [],
				totalItems: 0,
				currentPage: parseInt(filters.currentPage) || 1,
				pageSize: parseInt(filters.pageSize) || 10,
				totalPages: 0,
			};
		}
		courseStudentWhere.id = { [Op.in]: csIds };
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
				model: CourseGroup,
				required: false,
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
					{
						model: SubjectDays,
						required: false,
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
				model: CourseGroup,
				required: false,
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
	await CourseLevel.findOne({ where: { id: id } });

const getCourseProgramSizeByCourseStudent = async (course_student_id) => {
	const courseStudent = await CourseStudent.findOne({
		where: { id: course_student_id },
		include: [{ model: Course }],
	});
	if (!courseStudent) throw new Error('CourseStudent not found');

	const course = courseStudent.Course;
	if (!course) return null;

	const uses_sessions = !!course.uses_sessions;

	return {
		uses_sessions,
		days: course.days,
		sessions: course.sessions,
		total: uses_sessions ? course.sessions : course.days,
	};
};

const createCourse = async ({
	name,
	description,
	code,
	// hours,
	days,
	uses_sessions,
	sessions,
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
		uses_sessions,
		sessions,
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
	uses_sessions,
	sessions,
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
		uses_sessions,
		sessions,
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

const EDITABLE_COURSE_STUDENT_FIELDS = {
	date: 'date',
	student_id: 'student_id',
	type_trip: 'typeTrip',
	license: 'license',
	regulation: 'regulation',
instructor_code: 'instructorCode',
	course_group_id: 'courseGroupId',
	client: 'client',
};

const editCourseStudent = async (course_student_id, data) => {
	const courseStudent =
		await CourseStudent.findByPk(course_student_id);
	if (!courseStudent) throw new Error('Course not found');

	if (data.courseGroupId !== undefined && data.courseGroupId !== null) {
		const courseGroup = await CourseGroup.findByPk(data.courseGroupId);
		if (!courseGroup) throw new Error('CourseGroup not found');
		if (courseStudent.course_id !== courseGroup.course_id)
			throw new Error(
				'Student course does not match the group course',
			);
	}

	const updateData = {};
	for (const [dbField, reqField] of Object.entries(EDITABLE_COURSE_STUDENT_FIELDS)) {
		if (data[reqField] !== undefined) {
			updateData[dbField] = data[reqField];
		}
	}

	if (Object.keys(updateData).length === 0) return courseStudent;

	await courseStudent.update(updateData);
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

const deleteScheduleById = async (id) => {
	const schedule = await Schedule.findByPk(id, {
		include: [{ model: SubjectDays }],
	});
	if (!schedule) {
		throw new Error('Schedule not found');
	}

	const ordinal = schedule.SubjectDays?.day ?? null;
	const canCascade = Boolean(schedule.date) && ordinal !== null;

	return sequelize.transaction(async (transaction) => {
		let deletedAttendanceCount = 0;
		let deletedSignatureCount = 0;

		if (canCascade) {
			const attendances = await Attendance.findAll({
				attributes: ['id'],
				where: {
					course_student_id: schedule.course_student_id,
					date: schedule.date,
					day: ordinal,
				},
				transaction,
			});

			const attendanceIds = attendances.map((a) => a.id);

			if (attendanceIds.length > 0) {
				deletedSignatureCount = await AttendanceSignature.destroy({
					where: { attendance_id: attendanceIds },
					transaction,
				});
				deletedAttendanceCount = await Attendance.destroy({
					where: { id: attendanceIds },
					transaction,
				});
			}
		}

		await schedule.destroy({ transaction });

		return {
			deleted_count: 1,
			deleted_attendance_count: deletedAttendanceCount,
			deleted_signature_count: deletedSignatureCount,
		};
	});
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

const getScheduleByInstructor = async (instructor_id) => {
	const data = await Schedule.findAll({
		where: { instructor_id },
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
				model: SubjectDays,
			},
			{
				model: Subject,
			},
		],
		order: [
			['date', 'ASC'],
			['hour', 'ASC'],
		],
	});
	return data;
};

export {
	getAllCourses,
	getAllCoursesStudent,
	getAllCoursesTypes,
	getAllCoursesLevel,
	getCourseById,
	getCourseTypeById,
	getCourseLevelById,
	getCourseProgramSizeByCourseStudent,
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
	deleteScheduleById,
	updateCourseStudentMaxAttempts,
	getScheduleByInstructor,
};

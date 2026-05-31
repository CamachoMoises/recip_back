import { Op } from 'sequelize';
import { models } from '../index.js';

const { Attendance, AttendanceStatus, CourseStudent } = models;

const getAllAttendance = async (filters = {}) => {
	const where = {};

	if (filters.course_student_id) {
		where.course_student_id = filters.course_student_id;
	}
	if (filters.attendance_status_id) {
		where.attendance_status_id = filters.attendance_status_id;
	}
	if (filters.date_from && filters.date_to) {
		where.date = {
			[Op.between]: [filters.date_from, filters.date_to],
		};
	} else if (filters.date_from) {
		where.date = { [Op.gte]: filters.date_from };
	} else if (filters.date_to) {
		where.date = { [Op.lte]: filters.date_to };
	}

	const pageSize = parseInt(filters.pageSize) || 10;
	const currentPage = parseInt(filters.currentPage) || 1;
	const offset = (currentPage - 1) * pageSize;

	const result = await Attendance.findAndCountAll({
		distinct: true,
		col: 'id',
		where,
		include: [
			{
				model: CourseStudent,
			},
			{
				model: AttendanceStatus,
			},
		],
		order: [['date', 'DESC']],
		limit: pageSize,
		offset,
	});

	return {
		data: result.rows,
		totalItems: result.count,
		currentPage,
		pageSize,
		totalPages: Math.ceil(result.count / pageSize),
	};
};

const getAttendanceById = async (id) => {
	const attendance = await Attendance.findByPk(id, {
		include: [
			{
				model: CourseStudent,
			},
			{
				model: AttendanceStatus,
			},
		],
	});
	if (!attendance) throw new Error('Attendance not found');
	return attendance;
};

const getAttendanceByCourseStudent = async (course_student_id) =>
	await Attendance.findAll({
		where: { course_student_id },
		include: [
			{
				model: AttendanceStatus,
			},
		],
		order: [['date', 'DESC']],
	});

const getAttendanceByDateRange = async (start_date, end_date) =>
	await Attendance.findAll({
		where: {
			date: {
				[models.Sequelize.Op.between]: [start_date, end_date],
			},
		},
		include: [
			{
				model: CourseStudent,
			},
			{
				model: AttendanceStatus,
			},
		],
		order: [['date', 'DESC']],
	});

const createAttendance = async ({ course_student_id, date, attendance_status_id, comments, signature_url }) =>
	await Attendance.create({ course_student_id, date, attendance_status_id, comments, signature_url });

const updateAttendance = async ({ id, course_student_id, date, attendance_status_id, comments, signature_url }) => {
	const attendance = await Attendance.findByPk(id);
	if (!attendance) throw new Error('Attendance not found');
	await attendance.update({ course_student_id, date, attendance_status_id, comments, signature_url });
	return attendance;
};

const deleteAttendance = async (id) => {
	const attendance = await Attendance.findByPk(id);
	if (!attendance) throw new Error('Attendance not found');
	await attendance.destroy();
	return attendance;
};

const getAttendanceStatuses = async () =>
	await AttendanceStatus.findAll({ order: [['name', 'ASC']] });

const createAttendanceStatus = async ({ name, description }) =>
	await AttendanceStatus.create({ name, description });

const updateAttendanceStatus = async ({ id, name, description }) => {
	const status = await AttendanceStatus.findByPk(id);
	if (!status) throw new Error('Attendance Status not found');
	await status.update({ name, description });
	return status;
};

const deleteAttendanceStatus = async (id) => {
	const status = await AttendanceStatus.findByPk(id);
	if (!status) throw new Error('Attendance Status not found');
	await status.destroy();
	return status;
};

export {
	getAllAttendance,
	getAttendanceById,
	getAttendanceByCourseStudent,
	getAttendanceByDateRange,
	createAttendance,
	updateAttendance,
	deleteAttendance,
	getAttendanceStatuses,
	createAttendanceStatus,
	updateAttendanceStatus,
	deleteAttendanceStatus,
};

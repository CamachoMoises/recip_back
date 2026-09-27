import {
	createAttendanceSchema,
	updateAttendanceSchema,
	createAttendanceStatusSchema,
	updateAttendanceStatusSchema,
} from '../database/imput_validation/attendance.js';
import {
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
} from '../database/repositories/attendance.js';
import { getCourseProgramSizeByCourseStudent } from '../database/repositories/course.js';
import {
	upsertAttendanceSignature,
	getSignatureByAttendanceId,
	deleteAttendanceSignature,
} from '../database/repositories/attendanceSignature.js';
import { cloudinaryApp } from '../app.js';

export const ListAttendance = async (req, res) => {
	try {
		const filters = req.query;
		const result = await getAllAttendance(filters);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const GetAttendance = async (req, res) => {
	try {
		const { id } = req.params;
		const attendance = await getAttendanceById(id);
		res.send(attendance);
	} catch (error) {
		if (error.message === 'Attendance not found') {
			return res.status(404).send(error.message);
		}
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const GetAttendanceByCourseStudent = async (req, res) => {
	try {
		const { course_student_id } = req.query;
		if (!course_student_id) {
			return res.status(400).send('course_student_id is required');
		}
		const attendances = await getAttendanceByCourseStudent(course_student_id);
		res.send(attendances);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const GetAttendanceByDateRange = async (req, res) => {
	try {
		const { start_date, end_date } = req.query;
		if (!start_date || !end_date) {
			return res.status(400).send('start_date and end_date are required');
		}
		const attendances = await getAttendanceByDateRange(start_date, end_date);
		res.send(attendances);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

const resolveAttendanceOrdinal = async ({
	course_student_id,
	day,
	session_number,
}) => {
	const program = await getCourseProgramSizeByCourseStudent(course_student_id);
	const total = program?.total ?? null;

	if (program?.uses_sessions) {
		if (session_number === undefined) {
			return {
				error: 'session_number es requerido para cursos programados por sesiones.',
			};
		}
		if (total != null && session_number > total) {
			return {
				error: `session_number (${session_number}) excede las sesiones del curso (${total}).`,
			};
		}
		return { ordinal: session_number, total };
	}

	if (total != null && day > total) {
		return { error: `day (${day}) excede los días del curso (${total}).` };
	}
	return { ordinal: day, total };
};

export const CreateAttendance = async (req, res) => {
	const data = req.body;
	const { error, value } = createAttendanceSchema.validate(data);
	if (error) {
		return res.status(400).send(`Input Validation Error ${error.message}`);
	}
	try {
		const resolution = await resolveAttendanceOrdinal({
			course_student_id: value.course_student_id,
			day: value.day,
			session_number: value.session_number,
		});
		if (resolution.error) {
			return res.status(400).send(resolution.error);
		}
		value.day = resolution.ordinal;
		const attendance = await createAttendance(value);
		const created = await getAttendanceById(attendance.id);
		res.status(201).send(created);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateAttendance = async (req, res) => {
	const data = req.body;
	const { error, value } = updateAttendanceSchema.validate(data);
	if (error) return res.status(400).send(`Input Validation Error ${error.message}`);
	try {
		if (value.day !== undefined || value.session_number !== undefined) {
			const existing = await getAttendanceById(value.id);
			const courseStudentId = value.course_student_id || existing.course_student_id;
			const resolution = await resolveAttendanceOrdinal({
				course_student_id: courseStudentId,
				day: value.day,
				session_number: value.session_number,
			});
			if (resolution.error) {
				return res.status(400).send(resolution.error);
			}
			value.day = resolution.ordinal;
		}
		const attendance = await updateAttendance(value);
		const updated = await getAttendanceById(attendance.id);
		res.send(updated);
	} catch (error) {
		if (error.message === 'Attendance not found') {
			return res.status(404).send(error.message);
		}
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const DeleteAttendance = async (req, res) => {
	try {
		const { id } = req.params;
		await deleteAttendance(id);
		res.status(204).send();
	} catch (error) {
		if (error.message === 'Attendance not found') {
			return res.status(404).send(error.message);
		}
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListAttendanceStatuses = async (req, res) => {
	try {
		const statuses = await getAttendanceStatuses();
		res.send(statuses);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateAttendanceStatus = async (req, res) => {
	const data = req.body;
	const { error, value } = createAttendanceStatusSchema.validate(data);
	if (error) return res.status(400).send(`Input Validation Error ${error.message}`);
	try {
		const status = await createAttendanceStatus(value);
		res.status(201).send(status);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateAttendanceStatus = async (req, res) => {
	const data = { id: req.params.id, ...req.body };
	const { error, value } = updateAttendanceStatusSchema.validate(data);
	if (error) return res.status(400).send(`Input Validation Error ${error.message}`);
	try {
		const status = await updateAttendanceStatus(value);
		res.send(status);
	} catch (error) {
		if (error.message === 'Attendance Status not found') {
			return res.status(404).send(error.message);
		}
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const DeleteAttendanceStatus = async (req, res) => {
	try {
		const { id } = req.params;
		await deleteAttendanceStatus(id);
		res.status(204).send();
	} catch (error) {
		if (error.message === 'Attendance Status not found') {
			return res.status(404).send(error.message);
		}
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const SaveAttendanceSignature = async (req, res) => {
	try {
		const { attendance_id, signature } = req.body;

		if (!signature) {
			return res.status(400).json({
				success: false,
				error: 'No se proporcionó la firma para guardar.',
			});
		}

		if (!attendance_id) {
			return res.status(400).json({
				success: false,
				error: 'El attendance_id es requerido.',
			});
		}

		const publicId = `firmas/attendance_signature_${attendance_id}`;

		const cloudinaryResult = await cloudinaryApp.uploader.upload(signature, {
			public_id: publicId,
			folder: 'firmas',
			format: 'webp',
			overwrite: true,
			transformation: [{ quality: 'auto' }],
		});

		const record = await upsertAttendanceSignature(
			attendance_id,
			cloudinaryResult.secure_url,
		);

		res.status(200).json({
			success: true,
			message: 'Firma guardada correctamente.',
			data: {
				signatureUrl: cloudinaryResult.secure_url,
				record,
			},
		});
	} catch (error) {
		console.error('Error en SaveAttendanceSignature:', error);
		res.status(500).json({
			success: false,
			error: 'Error al procesar la firma.',
		});
	}
};

export const DeleteAttendanceSignature = async (req, res) => {
	try {
		const { id } = req.params;
		const signature = await getSignatureByAttendanceId(id);

		if (!signature) {
			return res.status(404).json({
				success: false,
				error: 'Firma no encontrada.',
			});
		}

		const publicId = `firmas/attendance_signature_${id}`;

		await cloudinaryApp.uploader.destroy(publicId);

		await deleteAttendanceSignature(id);

		res.status(200).json({
			success: true,
			message: 'Firma eliminada correctamente.',
		});
	} catch (error) {
		console.error('Error en DeleteAttendanceSignature:', error);
		res.status(500).json({
			success: false,
			error: 'Error al eliminar la firma.',
		});
	}
};

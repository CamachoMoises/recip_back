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

export const CreateAttendance = async (req, res) => {
	const data = req.body;
	console.log('CreateAttendance body:', JSON.stringify(data));
	const { error, value } = createAttendanceSchema.validate(data);
	if (error) {
		console.log('CreateAttendance validation error:', error.message);
		return res.status(400).send(`Input Validation Error ${error.message}`);
	}
	try {
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

		const attendance = await updateAttendance({
			id: attendance_id,
			signature_url: cloudinaryResult.secure_url,
		});

		res.status(200).json({
			success: true,
			message: 'Firma guardada correctamente.',
			data: {
				signatureUrl: cloudinaryResult.secure_url,
				attendance,
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

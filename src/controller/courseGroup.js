import {
	createCourseGroupSchema,
	updateCourseGroupSchema,
	saveCourseGroupSignatureSchema,
} from '../database/imput_validation/courseGroup.js';
import {
	createCourseGroup,
	deleteCourseGroup,
	editCourseGroup,
	getAllCourseGroups,
	getCourseGroupById,
	getCourseStudentsByGroupId,
	removeCourseStudentsFromGroup,
} from '../database/repositories/courseGroup.js';
import {
	getNextSignatureNumber,
	createSignature,
	getSignaturesByGroupId,
	getSignatureById,
	deleteSignature,
} from '../database/repositories/courseGroupSignature.js';
import { models } from '../database/index.js';
import { cloudinaryApp } from '../app.js';

const { Course } = models;

export const ListCourseGroups = async (req, res) => {
	try {
		const filters = req.query;
		const result = await getAllCourseGroups(filters);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CourseGroupDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const courseGroup = await getCourseGroupById(id);
		if (!courseGroup) {
			return res.status(404).send('CourseGroup not found');
		}
		res.send(courseGroup);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CreateCourseGroup = async (req, res) => {
	const data = req.body;
	try {
		const validated = await createCourseGroupSchema.validateAsync(data);
		const { title, user_code, date, course_id } = validated;
		const courseGroup = await createCourseGroup({
			title,
			user_code,
			date,
			course_id,
		});
		const created = await getCourseGroupById(courseGroup.id);
		res.status(201).send(created);
	} catch (error) {
		console.log(error);
		res.status(400).send(`Input Validation Error ${error.message}`);
	}
};

export const UpdateCourseGroup = async (req, res) => {
	const data = req.body;
	try {
		const validated = await updateCourseGroupSchema.validateAsync(data);
		const courseGroup = await editCourseGroup(validated);
		res.send(courseGroup);
	} catch (error) {
		console.log(error);
		if (error.message === 'CourseGroup not found') {
			return res.status(404).send(error.message);
		}
		res.status(400).send(`Input Validation Error ${error.message}`);
	}
};

export const DeleteCourseGroup = async (req, res) => {
	const id = req.params.id;
	try {
		await deleteCourseGroup(id);
		res.status(204).send();
	} catch (error) {
		console.log(error);
		if (error.message === 'CourseGroup not found') {
			return res.status(404).send(error.message);
		}
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const ListCourseGroupStudents = async (req, res) => {
	const id = req.params.id;
	try {
		const filters = req.query;
		const result = await getCourseStudentsByGroupId(id, filters);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const SaveCourseGroupSignature = async (req, res) => {
	try {
		const validated =
			await saveCourseGroupSignatureSchema.validateAsync(req.body);
		const { course_group_id, day_number, signature } = validated;

		const courseGroup = await getCourseGroupById(course_group_id);
		if (!courseGroup) {
			return res.status(404).json({
				success: false,
				error: 'CourseGroup no encontrado.',
			});
		}

		const course = courseGroup.Course || await Course.findByPk(courseGroup.course_id);
		if (course && day_number > course.days) {
			return res.status(400).json({
				success: false,
				error: `day_number (${day_number}) excede los días del curso (${course.days}).`,
			});
		}

		let signature_number;
		try {
			signature_number = await getNextSignatureNumber(
				course_group_id,
				day_number,
			);
		} catch (err) {
			return res.status(400).json({
				success: false,
				error: err.message,
			});
		}

		const publicId = `firmas/course_group_${course_group_id}_day_${day_number}_${signature_number}`;

		const cloudinaryResult = await cloudinaryApp.uploader.upload(signature, {
			public_id: publicId,
			folder: 'firmas',
			format: 'webp',
			overwrite: true,
			transformation: [{ quality: 'auto' }],
		});

		const record = await createSignature(
			course_group_id,
			day_number,
			signature_number,
			cloudinaryResult.secure_url,
		);

		res.status(200).json({
			success: true,
			message: 'Firma guardada correctamente.',
			data: {
				signatureUrl: cloudinaryResult.secure_url,
				signature_number,
				record,
			},
		});
	} catch (error) {
		console.error('Error en SaveCourseGroupSignature:', error);
		res.status(500).json({
			success: false,
			error: 'Error al procesar la firma.',
		});
	}
};

export const ListCourseGroupSignatures = async (req, res) => {
	try {
		const { id } = req.params;
		const signatures = await getSignaturesByGroupId(id);
		res.send(signatures);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const DeleteCourseGroupSignature = async (req, res) => {
	try {
		const { signatureId } = req.params;
		const signature = await getSignatureById(signatureId);

		if (!signature) {
			return res.status(404).json({
				success: false,
				error: 'Firma no encontrada.',
			});
		}

		const publicId = `firmas/course_group_${signature.course_group_id}_day_${signature.day_number}_${signature.signature_number}`;

		await cloudinaryApp.uploader.destroy(publicId);

		await deleteSignature(signatureId);

		res.status(200).json({
			success: true,
			message: 'Firma eliminada correctamente.',
		});
	} catch (error) {
		console.error('Error en DeleteCourseGroupSignature:', error);
		res.status(500).json({
			success: false,
			error: 'Error al eliminar la firma.',
		});
	}
};

export const RemoveCourseStudentsFromGroup = async (req, res) => {
	const groupId = req.params.id;
	const { course_student_ids } = req.query;

	try {
		if (!course_student_ids) {
			return res.status(400).json({
				error: 'course_student_ids query parameter is required (comma-separated)',
			});
		}

		const ids = course_student_ids
			.split(',')
			.map((id) => parseInt(id.trim()))
			.filter((id) => !isNaN(id));

		if (ids.length === 0) {
			return res.status(400).json({
				error: 'No valid course_student_ids provided',
			});
		}

		const removedCount = await removeCourseStudentsFromGroup(groupId, ids);

		res.status(200).json({
			message: `${removedCount} student(s) removed from group`,
			removed_count: removedCount,
		});
	} catch (error) {
		console.log(error);
		if (error.message === 'CourseGroup not found') {
			return res.status(404).json({ error: error.message });
		}
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

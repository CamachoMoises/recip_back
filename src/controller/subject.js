import {
	createSubjectSchema,
	updateSubjectSchema,
} from '../database/imput_validation/subject.js';
import {
	createSubject,
	createSubjectDay,
	editSubject,
	getAllCourseSubjects,
	getAllSubjects,
	getSubjectsDaysByFull,
	updateSubjectDay,
} from '../database/repositories/subject.js';

export const ListSubjects = async (req, res) => {
	try {
		const subjects = await getAllSubjects();
		res.send(subjects);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListSubjectsCourse = async (req, res) => {
	const id = req.params.id;
	try {
		const subjects = await getAllCourseSubjects(id);
		res.send(subjects);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateSubject = async (req, res) => {
	const data = req.body;
	try {
		const new_data = await createSubjectSchema.validateAsync(data);
		const { name, hours, course_id, order, status } = new_data;
		const new_subject = await createSubject({
			name,
			hours,
			course_id,
			order,
			status,
		});
		res.status(201).send(new_subject);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const UpdateSubject = async (req, res) => {
	const data = req.body;
	try {
		const new_data = await updateSubjectSchema.validateAsync(data);
		const { id, name, hours, course_id, order, status } = new_data;
		const edited_subject = await editSubject({
			id,
			name,
			hours,
			course_id,
			order,
			status,
		});
		res.status(201).send(edited_subject);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const ChangeStatusDay = async (req, res) => {
	const data = req.body;

	const validate = await getSubjectsDaysByFull(
		data.subject_id,
		data.course_id,
		data.day
	);
	try {
		console.log(data);
		const { subject_id, course_id, day, status } = data;
		if (!validate.length) {
			await createSubjectDay({
				subject_id,
				course_id,
				day,
				status,
			});
			console.log('ojo');
			res.status(201).send('OK');
		} else {
			const id = validate[0].id;
			await updateSubjectDay({
				id,
				subject_id,
				course_id,
				day,
				status,
			});
			res.status(201).send('OK');
		}
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

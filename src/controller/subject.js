import {
	createSubjectSchema,
	updateSubjectSchema,
} from '../database/imput_validation/subject.js';
import {
	checkStatusDay,
	createSubject,
	createSubjectDay,
	createSubjectLesson,
	createSubjectLessonDay,
	editSubject,
	editSubjectLesson,
	getAllCourseSubjects,
	getAllSubjects,
	getSubjectById,
	getSubjectsDaysByFull,
	getSubjectsLessonDaysByFull,
	updateSubjectDay,
	updateSubjectLessonDay,
} from '../database/repositories/subject.js';
import { calculateCourseTotalHours } from './course.js';

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

export const SubjectDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const subject = await getSubjectById(id);
		res.send(subject);
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
export const CreateSubjectLesson = async (req, res) => {
	const data = req.body;
	try {
		const { course_id, subject_id, name, order, status } = data;
		const new_subject = await createSubjectLesson({
			course_id,
			subject_id,
			name,
			order,
			status,
		});
		if (new_subject) {
			const subject = await getSubjectById(subject_id);
			res.status(201).send(subject);
		} else {
			throw new Error('new_subject not created');
		}
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
		const editedSubject = await editSubject({
			id,
			name,
			hours,
			course_id,
			order,
			status,
		});
		calculateCourseTotalHours(course_id);
		res.status(201).send(editedSubject);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};
export const UpdateSubjectLesson = async (req, res) => {
	const data = req.body;
	try {
		const { id, subject_id, name, order, status } = data;
		const editedSubjectLesson = await editSubjectLesson({
			id,
			name,
			order,
			status,
		});
		if (editedSubjectLesson) {
			const subject = await getSubjectById(subject_id);
			res.status(201).send(subject);
		} else {
			throw new Error('editedSubjectLesson not updated');
		}
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
	const { subject_id, course_id, day, status } = data;

	try {
		const subject_days = await ChangeStatusDayFunc(
			subject_id,
			course_id,
			day,
			status
		);
		if (subject_days) {
			res.status(201).send('OK');
		} else {
			throw new Error('Subject Day not found');
		}
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const ChangeStatusLessonDay = async (req, res) => {
	const data = req.body;
	try {
		const {
			subject_id,
			subject_lesson_id,
			subject_lesson_days_id,
			course_id,
			day,
			status_lesson,
		} = data;
		let subject_days_status = false;
		if (status_lesson) {
			subject_days_status = status_lesson;
		} else {
			subject_days_status = await checkStatusDay(
				subject_id,
				subject_lesson_days_id,
				day
			);
		}

		const subject_days = await ChangeStatusDayFunc(
			subject_id,
			course_id,
			day,
			subject_days_status
		);
		const validate = await getSubjectsLessonDaysByFull(
			course_id,
			subject_id,
			subject_days.id,
			subject_lesson_id,
			day
		);
		if (!validate.length) {
			const subject_lesson_days = await createSubjectLessonDay({
				course_id,
				subject_id,
				subject_days_id: subject_days.id,
				subject_lesson_id,
				day,
				status: status_lesson,
			});
			if (subject_lesson_days) {
				res.status(201).send('OK');
			} else {
				throw new Error('subject_lesson_days not created');
			}
		} else {
			const id = validate[0].id;
			const subject_lesson_days = await updateSubjectLessonDay({
				id,
				status: status_lesson,
			});
			if (subject_lesson_days) {
				res.status(201).send('OK');
			} else {
				throw new Error('subject_lesson_days not updated');
			}
		}
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const ChangeStatusDayFunc = async (
	subject_id,
	course_id,
	day,
	status
) => {
	const validate = await getSubjectsDaysByFull(
		subject_id,
		course_id,
		day
	);
	let subject_days = null;
	if (!validate.length) {
		subject_days = await createSubjectDay({
			subject_id,
			course_id,
			day,
			status,
		});
	} else {
		const id = validate[0].id;

		subject_days = await updateSubjectDay({
			id,
			status,
		});
	}

	calculateCourseTotalHours(course_id);
	return subject_days;
};

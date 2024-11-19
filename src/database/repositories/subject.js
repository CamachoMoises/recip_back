import { models } from '../initDB.js';

const { Subject, SubjectDays } = models;

const getAllSubjects = async () => await Subject.findAll();

const getAllCourseSubjects = async (id) => {
	const data = await Subject.findAll({
		where: {
			course_id: id,
		},
		order: [['order', 'ASC']],
		include: [
			{
				model: SubjectDays,
			},
		],
	});
	return data;
};
const createSubject = async ({
	name,
	hours,
	course_id,
	order,
	status,
}) =>
	Subject.create({
		name,
		hours,
		course_id,
		order,
		status,
	});

const editSubject = async ({
	id,
	name,
	course_id,
	order,
	status,
}) => {
	const subject = await Subject.findByPk(id);
	if (!subject) {
		throw new Error('Course not found');
	}
	await subject.update({
		id,
		name,
		course_id,
		order,
		status,
	});
	return subject;
};

const getSubjectsDaysByFull = async (subject_id, course_id, day) => {
	const data = await SubjectDays.findAll({
		where: {
			subject_id,
			course_id,
			day,
		},
		include: [
			{
				model: Subject,
			},
		],
	});
	return data;
};

const createSubjectDay = async ({
	subject_id,
	course_id,
	day,
	status,
}) => {
	return await SubjectDays.create({
		subject_id,
		course_id,
		day,
		status,
	});
};
const updateSubjectDay = async ({
	id,
	subject_id,
	course_id,
	day,
	status,
}) => {
	const subjectDay = await SubjectDays.findByPk(id);
	if (!subjectDay) {
		throw new Error('Subject Day not found');
	}
	await subjectDay.update({
		id,
		subject_id,
		course_id,
		day,
		status,
	});
	return subjectDay;
};

export {
	getAllSubjects,
	getAllCourseSubjects,
	createSubject,
	editSubject,
	getSubjectsDaysByFull,
	createSubjectDay,
	updateSubjectDay,
};

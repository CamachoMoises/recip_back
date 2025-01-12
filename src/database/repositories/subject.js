import { models } from '../initDB.js';
import { Op } from 'sequelize';

const {
	Course,
	Subject,
	SubjectDays,
	SubjectLesson,
	SubjectLessonDays,
} = models;

const getAllSubjects = async () => await Subject.findAll();

const getSubjectById = async (id) => {
	const subject = await Subject.findOne({
		where: { id: id },
		include: [
			{
				model: Course,
			},
			{
				model: SubjectLesson,
				include: [SubjectLessonDays],
			},
			{
				model: SubjectDays,
			},
		],
	});
	return subject;
};
const getSubjectByCourseId = async (course_id) => {
	const subjects = await Subject.findAll({
		where: { course_id },
		include: [
			{
				model: SubjectDays,
				where: { status: true },
			},
			{
				model: Course,
			},
		],
	});

	return subjects;
};
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
const getAllCourseSubjectsLesson = async (id) => {
	const data = await Subject.findAll({
		where: {
			course_id: id,
		},
		order: [['order', 'ASC']],
		include: [
			{
				model: SubjectDays,
			},
			{
				model: SubjectLesson,
				include: [SubjectLessonDays],
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
	await Subject.create({
		name,
		hours,
		course_id,
		order,
		status,
	});

const createSubjectLesson = async ({
	course_id,
	subject_id,
	name,
	order,
	status,
}) =>
	await SubjectLesson.create({
		course_id,
		subject_id,
		name,
		order,
		hours: 1,
		status,
	});

const editSubject = async ({
	id,
	name,
	hours,
	course_id,
	order,
	status,
}) => {
	const subject = await Subject.findByPk(id);
	if (!subject) {
		throw new Error('subject not found');
	}
	await subject.update({
		id,
		name,
		hours,
		course_id,
		order,
		status,
	});
	return subject;
};
const editSubjectLesson = async ({ id, name, order, status }) => {
	const subjectLesson = await SubjectLesson.findByPk(id);
	if (!subjectLesson) {
		throw new Error('subjectLesson not found');
	}
	await subjectLesson.update({
		id,
		name,
		order,
		status,
	});
	return subjectLesson;
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

const getSubjectsLessonDaysByFull = async (
	course_id,
	subject_id,
	subject_days_id,
	subject_lesson_id,
	day
) => {
	const data = await SubjectLessonDays.findAll({
		where: {
			course_id,
			subject_id,
			subject_days_id,
			subject_lesson_id,
			day,
		},
	});
	return data;
};

const checkStatusDay = async (
	subject_id,
	subject_lesson_days_id,
	day
) => {
	const excludeID = [subject_lesson_days_id];
	const subject_lesson_days = await SubjectLessonDays.findAll({
		where: {
			id: { [Op.notIn]: excludeID },
			status: true,
			day: day,
			subject_id: subject_id,
		},
	});
	if (subject_lesson_days.length > 0) {
		return true;
	} else {
		return false;
	}
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
const createSubjectLessonDay = async ({
	course_id,
	subject_id,
	subject_days_id,
	subject_lesson_id,
	day,
	status,
}) => {
	return await SubjectLessonDays.create({
		course_id,
		subject_id,
		subject_days_id,
		subject_lesson_id,
		day,
		status,
	});
};
const updateSubjectDay = async ({ id, status }) => {
	const subjectDay = await SubjectDays.findByPk(id);
	if (!subjectDay) {
		throw new Error('Subject Day not found');
	}
	await subjectDay.update({
		status,
	});
	return subjectDay;
};

const updateSubjectLessonDay = async ({ id, status }) => {
	const subjectLessonDays = await SubjectLessonDays.findByPk(id);
	if (!subjectLessonDays) {
		throw new Error('Subject Day not found');
	}
	await subjectLessonDays.update({
		status,
	});
	return subjectLessonDays;
};

export {
	getAllSubjects,
	getSubjectById,
	getSubjectByCourseId,
	getAllCourseSubjects,
	getAllCourseSubjectsLesson,
	createSubject,
	createSubjectLesson,
	editSubject,
	editSubjectLesson,
	getSubjectsDaysByFull,
	getSubjectsLessonDaysByFull,
	createSubjectDay,
	createSubjectLessonDay,
	updateSubjectDay,
	updateSubjectLessonDay,
	checkStatusDay,
};

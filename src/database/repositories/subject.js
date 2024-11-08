import { models } from '../initDB.js';

const { Subject } = models;

const getAllSubjects = async () => await Subject.findAll();

const getAllCourseSubjects = async ({ id }) =>
	await Subject.findAll({
		where: {
			course_id: id, // Aquí defines el valor específico de course_id que buscas
		},
	});

export { getAllSubjects, getAllCourseSubjects };

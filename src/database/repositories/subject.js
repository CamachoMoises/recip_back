import { models } from '../initDB.js';

const { Subject } = models;

const getAllSubjects = async () => await Subject.findAll();

const getAllCourseSubjects = async (id) => {
	const data = await Subject.findAll({
		where: {
			course_id: id,
		},
		order: [['order', 'ASC']],
	});
	return data;
};

export { getAllSubjects, getAllCourseSubjects };

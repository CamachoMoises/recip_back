import { models } from '../initDB.js';

const { Course, CourseType } = models;

const getAllCourses = async () =>
	Course.findAll({
		include: [CourseType],
	});

export { getAllCourses };

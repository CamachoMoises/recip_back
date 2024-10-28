import { getAllCourses } from '../database/repositories/course.js';

export const ListCourses = async (req, res) => {
	try {
		const courses = await getAllCourses();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

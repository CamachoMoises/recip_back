import { createCourseSchema } from '../database/imput_validation/course.js';
import {
	createCourse,
	getAllCourses,
	getAllCoursesTypes,
} from '../database/repositories/course.js';

export const ListCourses = async (req, res) => {
	try {
		const courses = await getAllCourses();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const ListCoursesTypes = async (req, res) => {
	try {
		const courses = await getAllCoursesTypes();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateCourse = async (req, res) => {
	const data = req.body;
	const course_type_id = data.type;
	delete data.type;
	delete data.course_type;
	data.course_type_id = course_type_id;

	try {
		createCourseSchema.validateAsync(data);
		console.log('Validación exitosa');
		const { name, description, hours, course_type_id, status } = data;
		console.log(data);
		try {
			const course = null;
			// 	await createCourse({
			// 	name,
			// 	description,
			// 	hours,
			// 	course_type_id,
			// 	status,
			// });
			res.status(201).send(course);
		} catch (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

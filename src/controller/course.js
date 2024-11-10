import {
	createCourseSchema,
	updateCourseSchema,
} from '../database/imput_validation/course.js';
import {
	createCourse,
	editCourse,
	getAllCourses,
	getAllCoursesTypes,
	getCourseById,
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
		console.log('iniciando validacion');
		const new_data = await createCourseSchema.validateAsync(data);
		console.log('Validación exitosa');
		const { name, description, hours, days, course_type_id, status } =
			new_data;

		const new_course = await createCourse({
			name,
			description,
			hours,
			days,
			course_type_id,
			status,
		});
		const course = await getCourseById(new_course.id);

		// console.log(course, 'OJOJOJOJO');
		res.status(201).send(course);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};
export const UpdateCourse = async (req, res) => {
	const data = req.body;
	const course_type_id = data.type;
	delete data.type;
	delete data.course_type;
	data.course_type_id = course_type_id;
	try {
		console.log('iniciando validacion');
		const new_data = await updateCourseSchema.validateAsync(data);
		console.log('Validación exitosa');
		const {
			id,
			name,
			description,
			hours,
			days,
			course_type_id,
			status,
		} = new_data;
		await editCourse({
			id,
			name,
			description,
			hours,
			days,
			course_type_id,
			status,
		});
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

import {
	createCourseSchema,
	updateCourseSchema,
} from '../database/imput_validation/course.js';
import {
	createCourse,
	createCourseStudent,
	createSchedule,
	editCourse,
	editCourseStudent,
	getAllCourses,
	getAllCoursesLevel,
	getAllCoursesStudent,
	getAllCoursesTypes,
	getAllSchedule,
	getCourseById,
	getCourseStudentById,
	updateSchedule,
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
export const ListCoursesStudent = async (req, res) => {
	try {
		const coursesStudent = await getAllCoursesStudent();
		res.send(coursesStudent);
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
export const ListCoursesLevel = async (req, res) => {
	try {
		const courses = await getAllCoursesLevel();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CourseDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CourseStudentDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const courseStudent = await getCourseStudentById(id);
		res.send(courseStudent);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateCourse = async (req, res) => {
	const data = req.body;
	const course_type_id = data.type;
	const course_level_id = data.level;
	delete data.type;
	delete data.level;
	delete data.course_type;
	delete data.course_level;
	data.course_type_id = course_type_id;
	data.course_level_id = course_level_id;

	try {
		const new_data = await createCourseSchema.validateAsync(data);
		const {
			name,
			description,
			// hours,
			days,
			course_type_id,
			course_level_id,
			status,
		} = new_data;

		const new_course = await createCourse({
			name,
			description,
			// hours,
			days,
			course_type_id,
			course_level_id,
			status,
		});
		const course = await getCourseById(new_course.id);
		res.status(201).send(course);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const CreateCourseStudent = async (req, res) => {
	const course_id = req.params.course_id;
	const course = await getCourseById(course_id);
	if (!course) {
		return res.status(404).send('Curso no encontrado');
	} else {
		try {
			const courseStudent = await createCourseStudent(course_id);
			res.send(courseStudent);
		} catch (error) {
			console.error('Error en la creacion:', error.message);
			console.log(error.message);
			return res
				.status(400)
				.send(`Input Validation Error ${error.message}`);
		}
	}
};

export const UpdateCourse = async (req, res) => {
	const data = req.body;
	const course_type_id = data.type;
	const course_level_id = data.level;
	delete data.type;
	delete data.level;
	delete data.hours;
	delete data.course_type;
	delete data.course_level;
	data.course_type_id = course_type_id;
	data.course_level_id = course_level_id;
	try {
		const new_data = await updateCourseSchema.validateAsync(data);
		const {
			id,
			name,
			description,
			// hours,
			days,
			course_type_id,
			course_level_id,
			status,
		} = new_data;
		await editCourse({
			id,
			name,
			description,
			// hours,
			days,
			course_type_id,
			course_level_id,
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

export const UpdateCourseStudent = async (req, res) => {
	const data = req.body;
	const course_id = req.params.course_id;
	const {
		course_student_id,
		date,
		student_id,
		typeTrip,
		license,
		regulation,
	} = data;

	try {
		const courseStudentEdited = await editCourseStudent(
			course_id,
			course_student_id,
			date,
			student_id,
			typeTrip,
			license,
			regulation
		);
		res.send(courseStudentEdited);
	} catch (error) {
		console.error('Error en la actualizacion:', error.message);
		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const ListSchedule = async (req, res) => {
	const id = req.params.id;
	try {
		const schedule = await getAllSchedule(id);
		res.send(schedule);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateSchedule = async (req, res) => {
	const data = req.body;
	const {
		instructor_id,
		course_id,
		subject_days_id,
		student_id,
		subject_days_subject_id,
		course_student_id,
		date,
		hour,
		classTime,
	} = data;
	try {
		const newSchedule = await createSchedule(
			instructor_id,
			course_id,
			subject_days_id,
			student_id,
			subject_days_subject_id,
			course_student_id,
			date,
			hour,
			classTime
		);
		res.send(newSchedule);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const UpdateSchedule = async (req, res) => {
	const data = req.body;
	console.log(data);

	const { id, instructor_id, date, hour, classTime } = data;
	try {
		const editSchedule = await updateSchedule(
			id,
			instructor_id,
			date,
			hour,
			classTime
		);
		res.send(editSchedule);
	} catch (error) {
		console.error('Error en la validación:', error.message);

		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

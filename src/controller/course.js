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
	getScheduleById,
	updateCourseHours,
	updateSchedule,
} from '../database/repositories/course.js';
import { getSubjectByCourseId } from '../database/repositories/subject.js';

export const ListCourses = async (req, res) => {
	try {
		const filters = req.query;
		const courses = await getAllCourses(filters);
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};
export const ListCoursesStudent = async (req, res) => {
	try {
		const filters = req.query;
		const dataCoursesStudent = await getAllCoursesStudent(filters);
		console.log(filters, 'OJO Caso');
		res.send(dataCoursesStudent);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};
export const ListCoursesTypes = async (req, res) => {
	try {
		const courses = await getAllCoursesTypes();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};
export const ListCoursesLevel = async (req, res) => {
	try {
		const courses = await getAllCoursesLevel();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CourseDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CourseStudentDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const courseStudent = await getCourseStudentById(id);
		res.send(courseStudent);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
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
			plane_model,
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
			plane_model,
			course_type_id,
			course_level_id,
			status,
		});
		const course = await getCourseById(new_course.id);
		res.status(201).send(course);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
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
			plane_model,
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
			plane_model,

			days,
			course_type_id,
			course_level_id,
			status,
		});
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
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
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const ListSchedule = async (req, res) => {
	const id = req.params.id;
	try {
		const schedule = await getAllSchedule(id);
		res.send(schedule);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CreateSchedule = async (req, res) => {
	const data = req.body;
	const {
		instructor_id,
		course_id,
		subject_days_id,
		student_id,
		subject_id,
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
			subject_id,
			course_student_id,
			date,
			hour,
			classTime
		);
		const SC = await getScheduleById(newSchedule.id);
		res.send(SC);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
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
		const SC = await getScheduleById(editSchedule.id);
		res.send(SC);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const calculateCourseTotalHours = async (course_id) => {
	const subjects = await getSubjectByCourseId(course_id);
	let totalHours = 0;
	for (let index = 0; index < subjects.length; index++) {
		const subject = subjects[index];
		const course_type_id = subject.course.course_type_id;
		const hours = course_type_id === 2 ? 8 : subject.hours;
		const days = subject.subject_days.length;
		totalHours = totalHours + hours * days;
	}
	await updateCourseHours(course_id, totalHours);
};

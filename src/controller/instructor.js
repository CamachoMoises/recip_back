import { getScheduleByInstructor } from '../database/repositories/course.js';
import {
	getAssessmentsByInstructor,
} from '../database/repositories/assessment.js';
import {
	getTestsByInstructor,
} from '../database/repositories/test.js';
import {
	getSchedulesByInstructorGroupedByCourseStudent,
	getTestsByInstructorWithParticipation,
	getAttendanceByInstructorGroupedByCourseStudent,
	getEvaluationsByInstructorGroupedByCourseStudent,
} from '../database/repositories/instructor.js';

export const ListScheduleByInstructor = async (req, res) => {
	try {
		const instructor_id = req.params.instructor_id;
		if (!instructor_id || isNaN(instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const schedule = await getScheduleByInstructor(
			parseInt(instructor_id),
		);
		res.send(schedule);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListAssessmentsByInstructor = async (req, res) => {
	try {
		const filters = req.query;
		if (!filters.instructor_id || isNaN(filters.instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const result = await getAssessmentsByInstructor(filters);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListTestsByInstructor = async (req, res) => {
	try {
		const filters = req.query;
		if (!filters.instructor_id || isNaN(filters.instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const result = await getTestsByInstructor(filters);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListSchedulesByInstructorGrouped = async (req, res) => {
	try {
		const instructor_id = req.params.instructor_id;
		if (!instructor_id || isNaN(instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const schedule = await getSchedulesByInstructorGroupedByCourseStudent(
			parseInt(instructor_id),
		);
		res.send(schedule);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListTestsByInstructorWithParticipation = async (req, res) => {
	try {
		const instructor_id = req.params.instructor_id;
		if (!instructor_id || isNaN(instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const result = await getTestsByInstructorWithParticipation(
			parseInt(instructor_id),
		);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListAttendanceByInstructorGrouped = async (req, res) => {
	try {
		const instructor_id = req.params.instructor_id;
		if (!instructor_id || isNaN(instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const result = await getAttendanceByInstructorGroupedByCourseStudent(
			parseInt(instructor_id),
		);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListEvaluationsByInstructorGrouped = async (req, res) => {
	try {
		const instructor_id = req.params.instructor_id;
		if (!instructor_id || isNaN(instructor_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro instructor_id inválido' });
		}
		const result = await getEvaluationsByInstructorGroupedByCourseStudent(
			parseInt(instructor_id),
		);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

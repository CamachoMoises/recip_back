import moment from 'moment';
import {
	createCourseStudentAssessment,
	createCourseStudentAssessmentDay,
	getCourseStudentAssessmentById,
	getCourseStudentAssessmentDayByCSA,
	getCourseStudentAssessmentDayById,
	getSubjectsByAssessment,
	updateCourseStudentAssessmentDay,
} from '../database/repositories/assessment.js';

export const CourseStudentAssessmentDetails = async (req, res) => {
	try {
		const courseStudentAssessmentId = req.params.id;
		const courseStudentAssessment =
			await getCourseStudentAssessmentById({
				id: courseStudentAssessmentId,
			});
		res.send(courseStudentAssessment);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CourseStudentAssessmentDay = async (req, res) => {
	try {
		const CSA_id = req.query.CSA_id;
		const day = req.query.day;
		const course_id = req.query.course_id;
		const student_id = req.query.student_id;
		const course_student_id = req.query.course_student_id;
		console.log(req.query);
		const CSAD_prev = await getCourseStudentAssessmentDayByCSA({
			CSA_id,
			day,
		});
		if (CSAD_prev) {
			const CASD = await getCourseStudentAssessmentDayById({
				id: CSAD_prev.id,
			});
			res.send(CASD);
		} else {
			const CASD_created = await createCourseStudentAssessmentDay({
				course_id,
				student_id,
				course_student_id,
				course_student_assessment_id: CSA_id,
				day,
			});
			const CASD = await getCourseStudentAssessmentDayById({
				id: CASD_created.id,
			});
			res.send(CASD);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateCourseStudentAssessment = async (req, res) => {
	try {
		const data = req.body;
		const { course_id, student_id, course_student_id } = data;
		const date = moment().format('YYYY-MM-DD');
		console.log(course_id, student_id, course_student_id);
		const courseStudentAssessment =
			await createCourseStudentAssessment({
				course_id,
				student_id,
				course_student_id,
				date,
			});
		const newAssessment = await getCourseStudentAssessmentById({
			id: courseStudentAssessment.id,
		});
		res.status(201).send(newAssessment);
		// res.status(500).send('Internal Server Error');
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateCourseStudentAssessmentDay = async (req, res) => {
	try {
		const data = req.body;
		const {
			id,
			airport,
			airstrip,
			elevation,
			meteorology,
			temperature,
			qnh,
			wind,
			weight,
			flaps,
			power,
			seat,
			comments,
		} = data;
		const CSAD_update = await updateCourseStudentAssessmentDay({
			id,
			airport,
			airstrip,
			elevation,
			meteorology,
			temperature,
			qnh,
			wind,
			weight,
			flaps,
			power,
			seat,
			comments,
		});

		const CASD = await getCourseStudentAssessmentDayById({
			id: CSAD_update.id,
		});
		res.send(CASD);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const ListSubjectsAssessment = async (req, res) => {
	const params = req.query;
	console.log(params);
	const {
		day,
		course_id,

		course_student_assessment_day_id,
	} = params;
	try {
		const subjects = await getSubjectsByAssessment({
			day,
			course_id,
			course_student_assessment_day_id,
		});
		res.send(subjects);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

import moment from 'moment';

import {
	createCourseStudentAssessment,
	createCourseStudentAssessmentDay,
	createCourseStudentAssessmentLessonDay,
	getCourseStudentAssessmentById,
	getCourseStudentAssessmentDayByCSA,
	getCourseStudentAssessmentDayById,
	getSubjectBySubjectByCSA,
	getSubjectBySubjectId,
	getSubjectsByAssessment,
	getAssessmentScoreAverages,
	updateCourseStudentAssessmentApprove,
	updateCourseStudentAssessmentDay,
	updateCourseStudentAssessmentLessonDay,
} from '../database/repositories/assessment.js';
import {
	upsertAssessmentSignature,
	deleteAssessmentSignature,
} from '../database/repositories/assessmentSignature.js';
import { cloudinaryApp } from '../app.js';

const round1 = (value) =>
	value === null || value === undefined
		? null
		: Math.round(Number(value) * 10) / 10;

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
		const takeoff_day = req.query.takeoff_day;
		const takeoff_night = req.query.takeoff_night;
		const landing_day = req.query.landing_day;
		const landing_night = req.query.landing_night;
		const training_time = req.query.training_time;
		const check_time = req.query.check_time;
		const type = req.query.type;
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
				takeoff_day,
				takeoff_night,
				landing_day,
				landing_night,
				training_time,
				check_time,
				type,
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
export const CourseStudentAssessmentApprove = async (req, res) => {
	try {
		const data = req.body;
		const { course_student_assessment_id, approve } = data;
		const courseStudentAssessment =
			await updateCourseStudentAssessmentApprove({
				id: course_student_assessment_id,
				approve,
			});
		res.send(courseStudentAssessment);
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
			takeoff,
			landing,
			comments,
			takeoff_day,
			takeoff_night,
			landing_day,
			landing_night,
			training_time,
			check_time,
			type,
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
			takeoff,
			landing,
			comments,
			takeoff_day,
			takeoff_night,
			landing_day,
			landing_night,
			training_time,
			check_time,
			type,
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

export const ChangeCourseStudentAssessmentLessonDay = async (
	req,
	res,
) => {
	try {
		const data = req.body;
		const {
			id,
			course_id,
			student_id,
			course_student_id,
			course_student_assessment_id,
			course_student_assessment_day_id,
			subject_id,
			subject_lesson_id,
			subject_days_id,
			subject_lesson_days_id,
			item,
			score,
			score_2,
			score_3,
			day,
		} = data;
		if (id) {
			await updateCourseStudentAssessmentLessonDay({
				id,
				item,
				score,
				score_2,
				score_3,
			});
		} else {
			await createCourseStudentAssessmentLessonDay({
				course_id,
				student_id,
				course_student_id,
				course_student_assessment_id,
				course_student_assessment_day_id,
				subject_id,
				subject_lesson_id,
				subject_days_id,
				subject_lesson_days_id,
				item,
				score,
			});
		}
		const subject = await getSubjectBySubjectId({
			day,
			subject_id,
			course_student_assessment_day_id,
		});
		res.send(subject);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};
export const CourseStudentAssessmentData = async (req, res) => {
	try {
		let CASD = null;
		const CSA_id = req.query.CSA_id;
		const courseStudentAssessment =
			await getCourseStudentAssessmentById({
				id: CSA_id,
			});
		if (courseStudentAssessment.course_id) {
			CASD = await getSubjectBySubjectByCSA({
				CSA_id,
				course_id: courseStudentAssessment.course_id,
			});
		} else {
			throw new Error(
				'Cannot find Course Student Assessment Day for this Course Student Assessment',
			);
		}

		const averages = await getAssessmentScoreAverages({ CSA_id });
		const perDayMap = {};
		averages.perDay.forEach((row) => {
			perDayMap[row.course_student_assessment_day_id] = round1(
				row.score_average,
			);
		});

		const csaJSON = courseStudentAssessment.toJSON();
		if (csaJSON.CourseStudentAssessmentDays) {
			csaJSON.CourseStudentAssessmentDays.forEach((day) => {
				day.score_average = perDayMap[day.id] ?? null;
			});
		}
		csaJSON.course_score_average = round1(averages.course);

		res.send({ CSA: csaJSON, CASD });
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const SaveSignatures = async (req, res) => {
	try {
		const { CSAD_id, signature1, signature2, signature3 } = req.body;

		const hasAnySignature = signature1 || signature2 || signature3;
		if (!hasAnySignature) {
			return res.status(400).json({
				success: false,
				error: 'No se proporcionaron firmas para guardar.',
			});
		}

		const uploadResults = await Promise.all([
			signature1 ? uploadSignature(signature1, 1, CSAD_id) : null,
			signature2 ? uploadSignature(signature2, 2, CSAD_id) : null,
			signature3 ? uploadSignature(signature3, 3, CSAD_id) : null,
		]);

		const dbPromises = uploadResults
			.filter(Boolean)
			.map(({ type, cloudinaryUrl }) =>
				upsertAssessmentSignature(CSAD_id, type, cloudinaryUrl),
			);

		await Promise.all(dbPromises);

		const uploadedSignatures = {};
		uploadResults.forEach((result) => {
			if (!result) return;
			const key =
				result.type === 1
					? 'studentSignatureUrl'
					: result.type === 2
						? 'instructorSignatureUrl'
						: 'fcaaSignatureUrl';
			uploadedSignatures[key] = result.cloudinaryUrl;
		});

		res.status(200).json({
			success: true,
			message: 'Firmas procesadas correctamente.',
			data: uploadedSignatures,
		});
	} catch (error) {
		console.error('Error en SaveSignatures:', error);
		res.status(500).json({
			success: false,
			error: 'Error al procesar las firmas.',
		});
	}
};

export const DeleteAssessmentSignature = async (req, res) => {
	try {
		const { CSAD_id, type } = req.query;

		if (!CSAD_id || !type) {
			return res.status(400).json({
				success: false,
				error: 'CSAD_id y type son requeridos.',
			});
		}

		const typeNum = parseInt(type);
		if (![1, 2, 3].includes(typeNum)) {
			return res.status(400).json({
				success: false,
				error: 'type debe ser 1, 2 o 3.',
			});
		}

		const publicId = `firmas/signature_${typeNum}_${CSAD_id}`;

		await cloudinaryApp.uploader.destroy(publicId);

		await deleteAssessmentSignature(CSAD_id, typeNum);

		res.status(200).json({
			success: true,
			message: 'Firma eliminada correctamente.',
		});
	} catch (error) {
		console.error('Error en DeleteAssessmentSignature:', error);
		res.status(500).json({
			success: false,
			error: 'Error al eliminar la firma.',
		});
	}
};

const uploadSignature = async (
	signatureData,
	signatureType,
	CSAD_id,
) => {
	if (!signatureData) return null;

	const publicId = `firmas/signature_${signatureType}_${CSAD_id}`;

	const cloudinaryResult = await cloudinaryApp.uploader.upload(signatureData, {
		public_id: publicId,
		folder: 'firmas',
		format: 'webp',
		overwrite: true,
		transformation: [{ quality: 'auto' }],
	});

	return {
		type: signatureType,
		cloudinaryUrl: cloudinaryResult.secure_url,
	};
};

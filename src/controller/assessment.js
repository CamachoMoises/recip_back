import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

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
	updateCourseStudentAssessmentApprove,
	updateCourseStudentAssessmentDay,
	updateCourseStudentAssessmentLessonDay,
} from '../database/repositories/assessment.js';
import { cloudinaryApp } from '../app.js';
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
		res.send({ CSA: courseStudentAssessment, CASD });
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

		const uploadPromises = [];
		if (signature1)
			uploadPromises.push(uploadSignature(signature1, '1', CSAD_id));
		if (signature2)
			uploadPromises.push(uploadSignature(signature2, '2', CSAD_id));
		if (signature3)
			uploadPromises.push(uploadSignature(signature3, '3', CSAD_id));

		const [
			studentSignatureResult,
			instructorSignatureResult,
			fcaaSignatureResult,
		] = await Promise.all(uploadPromises);

		const uploadedSignatures = {
			...(studentSignatureResult && {
				studentSignatureUrl: studentSignatureResult.cloudinaryUrl,
				studentSignatureLocal: studentSignatureResult.localPath,
			}),
			...(instructorSignatureResult && {
				instructorSignatureUrl:
					instructorSignatureResult.cloudinaryUrl,
				instructorSignatureLocal: instructorSignatureResult.localPath,
			}),
			...(fcaaSignatureResult && {
				fcaaSignatureUrl: fcaaSignatureResult.cloudinaryUrl,
				fcaaSignatureLocal: fcaaSignatureResult.localPath,
			}),
		};

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

const uploadSignature = async (
	signatureData,
	signatureType,
	CSAD_id,
) => {
	if (!signatureData) return null;

	const publicId = `firmas/signature_${signatureType}_${CSAD_id}`;

	// Subir a Cloudinary y guardar localmente en paralelo
	const [cloudinaryResult, localPath] = await Promise.all([
		cloudinaryApp.uploader.upload(signatureData, {
			public_id: publicId,
			folder: 'firmas',
			format: 'webp',
			overwrite: true,
			transformation: [{ quality: 'auto' }],
		}),
		saveSignatureLocally(signatureData, signatureType, CSAD_id),
	]);

	return {
		cloudinaryUrl: cloudinaryResult.secure_url,
		localPath,
	};
};

const saveSignatureLocally = async (
	signatureData,
	signatureType,
	CSAD_id,
) => {
	// Directorio base configurable vía variable de entorno
	const baseDir =
		process.env.SIGNATURES_LOCAL_PATH || '/var/app/storage/firmas';
	const dir = path.join(baseDir, String(CSAD_id));

	// Crear directorio si no existe
	await fs.promises.mkdir(dir, { recursive: true });

	const filename = `signature_${signatureType}_${CSAD_id}.webp`;
	const filepath = path.join(dir, filename);

	// Detectar si es base64 o URL
	let buffer;
	if (signatureData.startsWith('data:')) {
		// Data URL: "data:image/png;base64,iVBOR..."
		const base64Data = signatureData.split(',')[1];
		buffer = Buffer.from(base64Data, 'base64');
	} else if (signatureData.startsWith('http')) {
		// URL remota: descargar el archivo
		const response = await fetch(signatureData);
		buffer = Buffer.from(await response.arrayBuffer());
	} else {
		// Asumir base64 puro
		buffer = Buffer.from(signatureData, 'base64');
	}

	await fs.promises.writeFile(filepath, buffer);

	console.log(`Firma guardada localmente: ${filepath}`);
	return filepath;
};

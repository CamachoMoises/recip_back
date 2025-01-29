import { models } from '../initDB.js';

const {
	Course,
	CourseLevel,
	CourseType,
	Student,
	CourseStudent,
	CourseStudentAssessment,
	CourseStudentAssessmentDay,
	CourseStudentAssessmentLessonDetail,
	Subject,
	SubjectDays,
	SubjectLesson,
	SubjectLessonDays,
	User,
	UserDocType,
} = models;

// const publicAttributes = { exclude: ['id'] };
const getCourseStudentAssessmentById = async ({ id }) => {
	return await CourseStudentAssessment.findOne({
		where: { id },
		include: [
			{
				model: Course,
				include: [
					{
						model: CourseLevel,
					},
					{
						model: CourseType,
					},
				],
			},
			{
				model: Student,
				include: [
					{
						model: User,
						include: [
							{
								model: UserDocType,
							},
						],
					},
				],
			},
			{
				model: CourseStudent,
			},
			{
				model: CourseStudentAssessmentDay,
			},
		],
	});
};
const getCourseStudentAssessmentDayByCSA = async ({
	CSA_id,
	day,
}) => {
	return await CourseStudentAssessmentDay.findOne({
		where: { course_student_assessment_id: CSA_id, day },
	});
};
const getCourseStudentAssessmentDayById = async ({ id }) => {
	return await CourseStudentAssessmentDay.findOne({
		where: { id },
	});
};
const getAllAssessment = async () =>
	await CourseStudentAssessment.findAll();

const createCourseStudentAssessment = async ({
	course_id,
	student_id,
	course_student_id,
	date,
}) => {
	let numberCode = 1;
	const prevCourseStudentAssessment =
		await CourseStudentAssessment.findOne({
			order: [['createdAt', 'DESC']],
		});
	if (prevCourseStudentAssessment) {
		numberCode = prevCourseStudentAssessment.id + 1;
	}
	const stringCode = String(numberCode).padStart(8, '0');
	const code = `CSA-${stringCode}`;
	const newCourseStudentAssessment =
		await CourseStudentAssessment.create({
			course_id,
			student_id,
			course_student_id,
			date,
			code,
		});
	return newCourseStudentAssessment;
};
const createCourseStudentAssessmentDay = async ({
	course_id,
	student_id,
	course_student_id,
	course_student_assessment_id,
	day,
}) => {
	const newCourseStudentAssessmentDay =
		await CourseStudentAssessmentDay.create({
			course_id,
			student_id,
			course_student_id,
			course_student_assessment_id,
			day,
		});
	return newCourseStudentAssessmentDay;
};
const updateCourseStudentAssessmentDay = async ({
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
}) => {
	const courseStudentAssessmentDay =
		await CourseStudentAssessmentDay.findByPk(id);
	if (!courseStudentAssessmentDay) {
		throw new Error('Course Student Assessment Day not found');
	}
	await courseStudentAssessmentDay.update({
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
	return courseStudentAssessmentDay;
};

const getSubjectsByAssessment = async ({
	day,
	course_id,
	course_student_assessment_day_id,
}) => {
	const subjects = await Subject.findAll({
		where: { course_id },
		include: [
			{
				model: SubjectDays,
				where: { day },
				required: true,
			},
			{
				model: SubjectLesson,
				include: [
					{
						model: SubjectLessonDays,
						where: { day },
						required: true,

						include: [
							{
								model: CourseStudentAssessmentLessonDetail,
								required: false,
								where: {
									course_student_assessment_day_id,
								},
							},
						],
					},
				],
			},
		],
	});
	return subjects;
};

const getSubjectBySubjectId = async ({
	subject_id,
	day,
	course_student_assessment_day_id,
}) => {
	const subject = await Subject.findOne({
		where: { id: subject_id },
		include: [
			{
				model: SubjectDays,
				where: { day },
				required: true,
			},
			{
				model: SubjectLesson,
				include: [
					{
						model: SubjectLessonDays,
						where: { day },
						required: true,

						include: [
							{
								model: CourseStudentAssessmentLessonDetail,
								required: false,
								where: {
									course_student_assessment_day_id,
								},
							},
						],
					},
				],
			},
		],
	});
	return subject;
};
const createCourseStudentAssessmentLessonDay = async ({
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
}) => {
	const newCourseStudentAssessmentLessonDetail =
		await CourseStudentAssessmentLessonDetail.create({
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
	return newCourseStudentAssessmentLessonDetail;
};

const updateCourseStudentAssessmentLessonDay = async ({
	id,
	item,
	score,
	score_2,
	score_3,
}) => {
	const courseStudentAssessmentLessonDetail =
		await CourseStudentAssessmentLessonDetail.findByPk(id);
	if (!courseStudentAssessmentLessonDetail) {
		throw new Error(
			'Course Student Assessment Lesson Detail not found'
		);
	}
	await courseStudentAssessmentLessonDetail.update({
		item,
		score,
		score_2,
		score_3,
	});
	return courseStudentAssessmentLessonDetail;
};

export {
	getAllAssessment,
	createCourseStudentAssessment,
	getCourseStudentAssessmentById,
	getCourseStudentAssessmentDayByCSA,
	getCourseStudentAssessmentDayById,
	createCourseStudentAssessmentDay,
	updateCourseStudentAssessmentDay,
	getSubjectsByAssessment,
	getSubjectBySubjectId,
	createCourseStudentAssessmentLessonDay,
	updateCourseStudentAssessmentLessonDay,
};

import { Sequelize } from 'sequelize';
import { models } from '../index.js';

const { Schedule, CourseStudent } = models;

const getCourseStudentIdsByInstructor = async (instructor_id) => {
	const rows = await Schedule.findAll({
		attributes: [
			[
				Sequelize.fn(
					'DISTINCT',
					Sequelize.col('course_student_id'),
				),
				'course_student_id',
			],
		],
		where: { instructor_id },
		raw: true,
	});
	return rows.map((r) => r.course_student_id).filter(Boolean);
};

const getCourseIdsByInstructor = async (instructor_id) => {
	const rows = await Schedule.findAll({
		attributes: [
			[
				Sequelize.fn(
					'DISTINCT',
					Sequelize.col('course_student.course_id'),
				),
				'course_id',
			],
		],
		where: { instructor_id },
		include: [
			{
				model: CourseStudent,
				attributes: [],
				required: true,
			},
		],
		raw: true,
	});
	return rows.map((r) => r.course_id).filter(Boolean);
};

export { getCourseStudentIdsByInstructor, getCourseIdsByInstructor };

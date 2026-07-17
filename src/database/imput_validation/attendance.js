import Joi from 'joi';

const createAttendanceSchema = Joi.object({
	course_student_id: Joi.number().integer().required(),
	date: Joi.date().required(),
	attendance_status_id: Joi.number().integer().required(),
	comments: Joi.any().allow('', null).optional(),
});

const updateAttendanceSchema = Joi.object({
	id: Joi.number().integer().required(),
	course_student_id: Joi.number().integer().optional(),
	date: Joi.date().optional(),
	attendance_status_id: Joi.number().integer().optional(),
	comments: Joi.any().allow('', null).optional(),
});

const createAttendanceStatusSchema = Joi.object({
	name: Joi.string().max(100).required(),
	description: Joi.string().allow('', null).optional(),
});

const updateAttendanceStatusSchema = Joi.object({
	id: Joi.number().integer().required(),
	name: Joi.string().max(100).optional(),
	description: Joi.string().allow('', null).optional(),
});

export { createAttendanceSchema, updateAttendanceSchema, createAttendanceStatusSchema, updateAttendanceStatusSchema };

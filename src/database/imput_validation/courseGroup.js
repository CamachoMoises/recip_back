import Joi from 'joi';

export const createCourseGroupSchema = Joi.object({
	title: Joi.string().max(500).required(),
	user_code: Joi.string().max(50).allow(null, ''),
	date: Joi.date().allow(null),
	course_id: Joi.number().integer().required(),
	status: Joi.boolean().default(true),
});

export const updateCourseGroupSchema = Joi.object({
	id: Joi.number().integer().required(),
	title: Joi.string().max(500).optional(),
	user_code: Joi.string().max(50).allow(null, ''),
	date: Joi.date().allow(null),
	status: Joi.boolean().optional(),
});

export const saveCourseGroupSignatureSchema = Joi.object({
	course_group_id: Joi.number().integer().required(),
	day_number: Joi.number().integer().min(1).required(),
	signature: Joi.string().required(),
});

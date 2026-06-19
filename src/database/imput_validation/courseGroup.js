import Joi from 'joi';

export const createCourseGroupSchema = Joi.object({
	title: Joi.string().max(500).required(),
	user_code: Joi.string().max(50).allow(null, ''),
	date: Joi.date().allow(null),
	course_id: Joi.number().integer().required(),
});

export const updateCourseGroupSchema = Joi.object({
	id: Joi.number().integer().required(),
	title: Joi.string().max(500).optional(),
	user_code: Joi.string().max(50).allow(null, ''),
	date: Joi.date().allow(null),
	signature_url: Joi.string().max(500).allow(null, ''),
});

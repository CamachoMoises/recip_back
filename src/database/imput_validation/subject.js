import Joi from 'joi';
import { getCourseById } from '../repositories/course.js';

const createSubjectSchema = Joi.object({
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	hours: Joi.number().required(),
	course_id: Joi.number()
		.required()
		.external(async (value, helpers) => {
			const record = await getCourseById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course not found',
				});
			}
			// console.log(value);
			return value;
		}),
	order: Joi.number(),
	status: Joi.alternatives().try(Joi.boolean(), Joi.number()),
});

const updateSubjectSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	hours: Joi.number().required(),
	course_id: Joi.number()
		.required()
		.external(async (value, helpers) => {
			const record = await getCourseById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course not found',
				});
			}
			// console.log(value);
			return value;
		}),
	order: Joi.number(),
	status: Joi.alternatives().try(Joi.boolean(), Joi.number()),
});

export { createSubjectSchema, updateSubjectSchema };

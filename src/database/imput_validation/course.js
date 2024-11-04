import Joi from 'joi';
import { getCourseById } from '../repositories/course.js';

const createCourseSchema = Joi.object({
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	description: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	hours: Joi.number().required(),
	course_type_id: Joi.number()
		.required()
		.custom(async (value, helpers) => {
			const record = await getCourseById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course type not found',
				});
			}
			console.log(value);
			return value;
		}),
	status: Joi.boolean(),
});

export { createCourseSchema };

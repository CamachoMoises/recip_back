import Joi from 'joi';
import {
	getCourseLevelById,
	getCourseTypeById,
} from '../repositories/course.js';

const createCourseSchema = Joi.object({
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	description: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	plane_model: Joi.string().max(500),
	// hours: Joi.number().required(),
	days: Joi.number().required(),
	course_type_id: Joi.number()
		.required()
		.external(async (value, helpers) => {
			const record = await getCourseTypeById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course type not found',
				});
			}
			// console.log(value);
			return value;
		}),
	course_level_id: Joi.number()
		.required()
		.external(async (value, helpers) => {
			const record = await getCourseLevelById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course level not found',
				});
			}
			// console.log(value);
			return value;
		}),
	status: Joi.boolean(),
});
const updateCourseSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	description: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	plane_model: Joi.string().max(500),
	// hours: Joi.number().required(),
	days: Joi.number().required(),

	course_type_id: Joi.number()
		.required()
		.external(async (value, helpers) => {
			const record = await getCourseTypeById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course type not found',
				});
			}
			// console.log(value);
			return value;
		}),
	course_level_id: Joi.number()
		.required()
		.external(async (value, helpers) => {
			const record = await getCourseLevelById(value);
			if (!record) {
				return helpers.error('custom', {
					message: 'Course level not found',
				});
			}
			// console.log(value);
			return value;
		}),
	status: Joi.boolean(),
});

export { createCourseSchema, updateCourseSchema };

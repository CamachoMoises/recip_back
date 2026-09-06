import Joi from 'joi';
import {
	getCourseLevelById,
	getCourseTypeById,
} from '../repositories/course.js';

const createCourseSchema = Joi.object({
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	description: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number(),
	),
	code: Joi.alternatives().try(Joi.string().max(50), Joi.number()),
	plane_model: Joi.string().max(500),
	// hours: Joi.number().required(),
	days: Joi.number().required(),
	course_type_id: Joi.number()
		.required()
		.external(async (value) => {
			const record = await getCourseTypeById(value);
			if (!record) {
				throw new Error('Course type not found');
			}
			return value;
		}),
	course_level_id: Joi.number()
		.required()
		.external(async (value) => {
			const record = await getCourseLevelById(value);
			if (!record) {
				throw new Error('Course level not found');
			}
			return value;
		}),
	status: Joi.boolean(),
});
const updateCourseSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	description: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number(),
	),
	code: Joi.alternatives().try(Joi.string().max(50), Joi.number()),
	plane_model: Joi.string().max(500),
	// hours: Joi.number().required(),
	days: Joi.number().required(),

	course_type_id: Joi.number()
		.required()
		.external(async (value) => {
			const record = await getCourseTypeById(value);
			if (!record) {
				throw new Error('Course type not found');
			}
			return value;
		}),
	course_level_id: Joi.number()
		.required()
		.external(async (value) => {
			const record = await getCourseLevelById(value);
			if (!record) {
				throw new Error('Course level not found');
			}
			return value;
		}),
	status: Joi.boolean(),
});

export { createCourseSchema, updateCourseSchema };

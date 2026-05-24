import Joi from 'joi';

const createSuggestionSchema = Joi.object({
	user_id: Joi.number().required(),
	title: Joi.string().max(500).required(),
	description: Joi.string().required(),
});

const updateSuggestionSchema = Joi.object({
	id: Joi.number().required(),
	user_id: Joi.number().required(),
	title: Joi.string().max(500).required(),
	description: Joi.string().required(),
});

export { createSuggestionSchema, updateSuggestionSchema };

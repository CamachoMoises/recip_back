import Joi from 'joi';

const createUserSchema = Joi.object({
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	last_name: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	doc_number: Joi.number().required(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.required(),
	phone: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	password: Joi.alternatives().try(
		Joi.string().max(200),
		Joi.number()
	),
	is_superuser: Joi.boolean(),
	is_staff: Joi.boolean(),
	is_active: Joi.boolean(),
});

export { createUserSchema };

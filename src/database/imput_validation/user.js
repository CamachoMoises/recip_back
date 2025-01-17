import Joi from 'joi';

const createUserSchema = Joi.object({
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	country_name: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	flag: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
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
	user_doc_type_id: Joi.number(),
	is_superuser: Joi.boolean(),
	is_staff: Joi.boolean(),
	is_active: Joi.boolean(),
});
const updateUserSchema = Joi.object({
	uuid: Joi.string().max(200).allow(null, ''),
	id: Joi.number().required(),
	name: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	country_name: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	flag: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	last_name: Joi.alternatives().try(
		Joi.string().max(500),
		Joi.number()
	),
	doc_number: Joi.number().required(),
	user_doc_type_id: Joi.number(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.required(),
	phone: Joi.alternatives().try(Joi.string().max(500), Joi.number()),
	password: Joi.alternatives().try(
		Joi.string().max(200).allow(null, ''),
		Joi.number()
	),
	is_superuser: Joi.boolean(),
	is_staff: Joi.boolean(),
	is_active: Joi.boolean(),
	createdAt: Joi.string().allow(null, ''),
	updatedAt: Joi.string().allow(null, ''),
});

export { createUserSchema, updateUserSchema };

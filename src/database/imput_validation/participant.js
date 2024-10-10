import Joi from 'joi';

const createParticipantShema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	docNumber: Joi.number().required(),
	email: Joi.string(),
	phone: Joi.string().max(14),
});

export { createParticipantShema };

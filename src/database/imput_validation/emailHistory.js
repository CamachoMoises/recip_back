import Joi from 'joi';

const createEmailHistorySchema = Joi.object({
	user_id: Joi.number().required(),
	nombre_archivo: Joi.string().max(500).required(),
	fecha: Joi.date().required(),
	tipo: Joi.string().max(100).default('correo'),
	descripcion: Joi.string().optional().allow(null, ''),
	modulo: Joi.string().optional().allow(null, ''),
});

export { createEmailHistorySchema };

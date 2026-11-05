import Joi from 'joi';

/**
 * Body de `POST /api/test/clone/:test_id`.
 * `status` no se declara a propósito: el clon siempre nace inactivo y
 * `stripUnknown` descarta cualquier campo extra que envíe el frontend.
 */
const cloneTestSchema = Joi.object({
	course_id: Joi.number().integer().positive().required(),
	code: Joi.string().trim().max(50).allow('', null),
	duration: Joi.number().integer().positive(),
	min_score: Joi.number().min(0),
});

export { cloneTestSchema };

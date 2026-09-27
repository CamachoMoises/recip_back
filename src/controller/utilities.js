const saltRounds = 10;
import bcrypt from 'bcryptjs';
export const generateRandomNumber = (digits) => {
	if (digits <= 0) return 0;

	const min = Math.pow(10, digits - 1); // Mínimo valor (por ejemplo, 1000 para 4 dígitos)
	const max = Math.pow(10, digits) - 1; // Máximo valor (por ejemplo, 9999 para 4 dígitos)

	return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomSubset = (array, newLength) => {
	if (array.length < newLength) {
		console.log(`El array debe tener más de ${newLength} elementos.`);
		throw new Error(
			`El array debe tener más de ${newLength} elementos.`,
		);
	} else {
		const shuffled = [...array].sort(() => Math.random() - 0.5); // Mezclar el array
		return shuffled.slice(0, newLength); // Tomar los primeros 10 elementos
	}
};

export const cleanString = (input) => {
	if (input === null || input === undefined) return '';
	return String(input).trim().toLowerCase().replace(/\s+/g, '');
};

export const hashPassword = (password) => {
	return bcrypt.hashSync(password, saltRounds);
};

export const redondear = (monto, decimales) => {
	const factor = Math.pow(10, decimales);
	return Math.round(monto * factor) / factor;
};

export const stringToBoolean = (str) => {
	if (str === 'true') return true;
	if (str === 'false') return false;
	throw new Error('The string is not "true" nor "false"');
};

// -----------------------------------------------------------------------------
// Test reports — deserialización de `course_student_test_answer.resp`
// -----------------------------------------------------------------------------

/**
 * Normaliza `resp` a un valor JS. `resp` es TEXT y guarda un JSON, pero según
 * el tipo de pregunta el contenido es: id numérico (tipos 1 y 3), array de
 * { id, check } (tipo 2) o array de textos (tipos 4 y 5).
 * Devuelve `null` en vez de lanzar: un GET de reporte no debe fallar por datos
 * legacy, a diferencia de `evaluateAnswers` que sí necesita abortar para poner
 * score 0.
 */
export const parseTestResponse = (resp) => {
	if (resp === null || resp === undefined || resp === '') return null;
	if (typeof resp === 'object') return resp;
	try {
		return JSON.parse(resp);
	} catch {
		return null;
	}
};

/**
 * Convierte la respuesta cruda del alumno en texto legible e ids de respuesta.
 *
 * @param {number} questionTypeId  1 | 2 | 3 | 4 | 5
 * @param {string} resp            valor crudo de `course_student_test_answer.resp`
 * @param {Array}  answers         `[{ id, value, is_correct }]` de la pregunta
 * @returns {{ selectedIds: number[], responseText: string, correctText: string }}
 *   Para tipos 1, 2 y 3 `selectedIds` son los `answer.id` que el alumno marcó.
 *   Para tipos 4 y 5 (texto libre) no hay ids en `resp`, así que devuelve los
 *   ids de las respuestas correctas que el alumno coincidió.
 */
export const resolveStudentResponse = ({
	questionTypeId,
	resp,
	answers = [],
}) => {
	const parsed = parseTestResponse(resp);
	const type = Number(questionTypeId);
	const options = answers
		.map((a) => ({
			id: Number(a.id),
			value: a.value === null || a.value === undefined ? '' : String(a.value),
			isCorrect: Boolean(a.is_correct),
		}))
		.filter((o) => !Number.isNaN(o.id));
	const correct = options.filter((o) => o.isCorrect);

	let selectedIds = [];
	let responseText = '';

	if (parsed !== null) {
		switch (type) {
			case 1:
			case 3: {
				const id = Number(parsed);
				if (!Number.isNaN(id)) selectedIds = [id];
				const found = options.find((o) => o.id === id);
				responseText = found
					? found.value
					: typeof parsed === 'object'
						? ''
						: String(parsed);
				break;
			}
			case 2: {
				if (Array.isArray(parsed)) {
					selectedIds = parsed
						.filter((r) => r && r.check)
						.map((r) => Number(r.id))
						.filter((id) => !Number.isNaN(id));
				}
				responseText = options
					.filter((o) => selectedIds.includes(o.id))
					.map((o) => o.value)
					.join(' | ');
				break;
			}
			case 4:
			case 5: {
				if (Array.isArray(parsed)) {
					const texts = parsed
						.map((v) => (v === null || v === undefined ? '' : String(v)))
						.filter((v) => v.trim() !== '');
					responseText = texts.join(' | ');
					selectedIds = correct
						.filter((o) => texts.some((t) => cleanString(t) === cleanString(o.value)))
						.map((o) => o.id);
				}
				break;
			}
			default:
				break;
		}
	}

	return {
		selectedIds,
		responseText,
		correctText: correct.map((o) => o.value).join(' | '),
	};
};

/**
 * Deriva CORRECTA / PARCIAL / INCORRECTA / SIN_RESPUESTA replicando la lógica de
 * `evaluateAnswers` pero en solo lectura: usa el `score` ya almacenado en
 * `course_student_test_answer` y nunca recalcula ni escribe nada.
 */
export const deriveAnswerResult = ({
	questionTypeId,
	resp,
	correctIds = [],
	score,
	pointsPossible,
}) => {
	const parsed = parseTestResponse(resp);
	if (parsed === null) return 'SIN_RESPUESTA';

	const type = Number(questionTypeId);
	const correct = correctIds.map(Number);

	if (type === 1 || type === 3) {
		const id = Number(parsed);
		if (Number.isNaN(id)) return 'SIN_RESPUESTA';
		return correct.includes(id) ? 'CORRECTA' : 'INCORRECTA';
	}

	if (type === 2) {
		const selected = Array.isArray(parsed)
			? parsed.filter((r) => r && r.check).map((r) => Number(r.id))
			: [];
		if (selected.length === 0) return 'SIN_RESPUESTA';
		const exactMatch =
			selected.length === correct.length &&
			selected.every((id) => correct.includes(id));
		if (exactMatch) return 'CORRECTA';
		return Number(score) > 0 ? 'PARCIAL' : 'INCORRECTA';
	}

	// Tipos 4 y 5: texto libre, el veredicto sale del score ya evaluado.
	const filled = Array.isArray(parsed)
		? parsed.filter((v) => String(v ?? '').trim() !== '').length
		: 0;
	if (filled === 0) return 'SIN_RESPUESTA';
	const value = Number(score) || 0;
	const possible = Number(pointsPossible) || 0;
	if (possible > 0 && value >= possible) return 'CORRECTA';
	return value > 0 ? 'PARCIAL' : 'INCORRECTA';
};

import { models } from '../index.js';

const { CourseGroupSignature } = models;

const getNextSignatureNumber = async (course_group_id, day_number) => {
	const count = await CourseGroupSignature.count({
		where: { course_group_id, day_number },
	});

	if (count >= 3) {
		throw new Error('Máximo de 3 firmas alcanzado para este día.');
	}

	return count + 1;
};

const createSignature = async (
	course_group_id,
	day_number,
	signature_number,
	signature_url,
) =>
	await CourseGroupSignature.create({
		course_group_id,
		day_number,
		signature_number,
		signature_url,
	});

const getSignaturesByGroupId = async (course_group_id) =>
	await CourseGroupSignature.findAll({
		where: { course_group_id },
		order: [
			['day_number', 'ASC'],
			['signature_number', 'ASC'],
		],
	});

const getSignatureById = async (id) =>
	await CourseGroupSignature.findByPk(id);

const deleteSignature = async (id) => {
	const signature = await CourseGroupSignature.findByPk(id);
	if (!signature) {
		throw new Error('Signature not found');
	}
	await signature.destroy();
	return signature;
};

export {
	getNextSignatureNumber,
	createSignature,
	getSignaturesByGroupId,
	getSignatureById,
	deleteSignature,
};

import { models } from '../index.js';

const { AssessmentSignature } = models;

const upsertAssessmentSignature = async (
	csad_id,
	signature_type,
	signature_url,
) => {
	const existing = await AssessmentSignature.findOne({
		where: { csad_id, signature_type },
	});

	if (existing) {
		await existing.update({ signature_url });
		return existing;
	}

	return await AssessmentSignature.create({
		csad_id,
		signature_type,
		signature_url,
	});
};

const getSignaturesByCSADId = async (csad_id) =>
	await AssessmentSignature.findAll({
		where: { csad_id },
		order: [['signature_type', 'ASC']],
	});

const deleteAssessmentSignature = async (csad_id, signature_type) => {
	const signature = await AssessmentSignature.findOne({
		where: { csad_id, signature_type },
	});
	if (!signature) {
		throw new Error('Signature not found');
	}
	await signature.destroy();
	return signature;
};

export {
	upsertAssessmentSignature,
	getSignaturesByCSADId,
	deleteAssessmentSignature,
};

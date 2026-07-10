import { models } from '../index.js';

const { CourseGroupSignature } = models;

const upsertSignature = async (course_group_id, day_number, signature_url) => {
	const existing = await CourseGroupSignature.findOne({
		where: { course_group_id, day_number },
	});

	if (existing) {
		await existing.update({ signature_url });
		return existing;
	}

	const created = await CourseGroupSignature.create({
		course_group_id,
		day_number,
		signature_url,
	});
	return created;
};

const getSignaturesByGroupId = async (course_group_id) =>
	await CourseGroupSignature.findAll({
		where: { course_group_id },
		order: [['day_number', 'ASC']],
	});

export { upsertSignature, getSignaturesByGroupId };

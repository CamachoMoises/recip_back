import { models } from '../index.js';

const { AttendanceSignature } = models;

const upsertAttendanceSignature = async (attendance_id, signature_url) => {
	const existing = await AttendanceSignature.findOne({
		where: { attendance_id },
	});

	if (existing) {
		await existing.update({ signature_url });
		return existing;
	}

	return await AttendanceSignature.create({ attendance_id, signature_url });
};

const getSignatureByAttendanceId = async (attendance_id) =>
	await AttendanceSignature.findOne({ where: { attendance_id } });

const deleteAttendanceSignature = async (attendance_id) => {
	const signature = await AttendanceSignature.findOne({
		where: { attendance_id },
	});
	if (!signature) {
		throw new Error('Signature not found');
	}
	await signature.destroy();
	return signature;
};

export {
	upsertAttendanceSignature,
	getSignatureByAttendanceId,
	deleteAttendanceSignature,
};

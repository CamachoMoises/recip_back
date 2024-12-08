import { models } from '../initDB.js';

const { Participant } = models;
const publicAttributes = { exclude: ['id'] };
const getAllParticipants = async () =>
	await Participant.findAll({ attributes: publicAttributes });

const createParticipant = async ({
	firstName,
	lastName,
	docNumber,
	email,
	phone,
}) =>
	await Participant.create({
		firstName,
		lastName,
		docNumber,
		email,
		phone,
	});
const getParticipantByUUID = async ({ uuid }) =>
	await Participant.findOne({
		where: { uuid },
		attributes: publicAttributes,
	});

const edictParticipant = async ({
	uuid,
	newFirstName,
	newLastName,
	newDocNumber,
	newEmail,
	newPhone,
}) => {
	const participant = await Participant.findOne({
		where: { uuid: uuid },
	});
	participant.firstName = newFirstName;
	participant.lastName = newLastName;
	participant.docNumber = newDocNumber;
	participant.email = newEmail;
	participant.phone = newPhone;
	await participant.save();
	return participant;
};

export {
	getAllParticipants,
	createParticipant,
	getParticipantByUUID,
	edictParticipant,
};

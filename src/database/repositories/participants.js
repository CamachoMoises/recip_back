import { models } from '../initDB.js';

const { Participant } = models;
const publicAttributes = { exclude: ['id'] };
const getAllParticipants = async () =>
	Participant.findAll({ attributes: publicAttributes });

const createParticipant = async ({
	firstName,
	lastName,
	docNumber,
	email,
	phone,
}) =>
	Participant.create({
		firstName,
		lastName,
		docNumber,
		email,
		phone,
	});

export { getAllParticipants, createParticipant };

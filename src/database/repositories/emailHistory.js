import { models } from '../index.js';

const { EmailHistory, User } = models;

const getAllEmailHistories = async (user_id) => {
	const where = {};
	if (user_id) where.user_id = user_id;

	return EmailHistory.findAll({
		where,
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['id', 'name', 'last_name', 'email'],
			},
		],
		order: [['fecha', 'DESC']],
	});
};

const createEmailHistory = async (data) =>
	EmailHistory.create(data);

const deleteEmailHistory = async (id) => {
	const emailHistory = await EmailHistory.findByPk(id);
	if (!emailHistory) throw new Error('Email history not found');
	await emailHistory.destroy();
	return true;
};

export { getAllEmailHistories, createEmailHistory, deleteEmailHistory };

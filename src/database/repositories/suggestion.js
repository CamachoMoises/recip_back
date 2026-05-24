import { models } from '../index.js';

const { UserSuggestion, User } = models;

const getAllSuggestions = async () =>
	UserSuggestion.findAll({
		include: [
			{
				model: User,
				as: 'user', // ← faltaba
				attributes: ['id', 'name', 'last_name', 'email'],
			},
		],
		order: [['created_at', 'DESC']],
	});

const getSuggestionById = async (id) => {
	const suggestion = await UserSuggestion.findByPk(id, {
		include: [
			{
				model: User,
				as: 'user', // ← faltaba
				attributes: ['id', 'name', 'last_name', 'email'],
			},
		],
	});
	if (!suggestion) throw new Error('Suggestion not found');
	return suggestion;
};

const getSuggestionsByUserId = async (user_id) =>
	UserSuggestion.findAll({
		where: { user_id },
		include: [
			{
				model: User,
				as: 'user', // ← faltaba
				attributes: ['id', 'name', 'last_name', 'email'],
			},
		],
		order: [['created_at', 'DESC']],
	});

const createSuggestion = async ({ user_id, title, description }) => {
	return UserSuggestion.create({ user_id, title, description });
};

const updateSuggestion = async ({
	id,
	user_id,
	title,
	description,
}) => {
	const suggestion = await UserSuggestion.findByPk(id);
	if (!suggestion) throw new Error('Suggestion not found');
	suggestion.user_id = user_id;
	suggestion.title = title;
	suggestion.description = description;
	await suggestion.save();
	return suggestion;
};

const deleteSuggestion = async (id) => {
	const suggestion = await UserSuggestion.findByPk(id);
	if (!suggestion) throw new Error('Suggestion not found');
	await suggestion.destroy();
	return true;
};

export {
	getAllSuggestions,
	getSuggestionById,
	getSuggestionsByUserId,
	createSuggestion,
	updateSuggestion,
	deleteSuggestion,
};

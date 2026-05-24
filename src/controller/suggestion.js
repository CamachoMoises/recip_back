import {
	createSuggestionSchema,
	updateSuggestionSchema,
} from '../database/imput_validation/suggestion.js';
import {
	createSuggestion,
	deleteSuggestion,
	getAllSuggestions,
	getSuggestionById,
	getSuggestionsByUserId,
	updateSuggestion,
} from '../database/repositories/suggestion.js';

export const ListSuggestions = async (req, res) => {
	try {
		const suggestions = await getAllSuggestions();
		res.send(suggestions);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const GetSuggestion = async (req, res) => {
	const { id } = req.params;
	try {
		const suggestion = await getSuggestionById(id);
		res.send(suggestion);
	} catch (error) {
		console.log(error);
		if (error.message === 'Suggestion not found') {
			return res.status(404).send('Suggestion not found');
		}
		res.status(500).send('Internal Server Error');
	}
};

export const ListSuggestionsByUser = async (req, res) => {
	const { user_id } = req.params;
	try {
		const suggestions = await getSuggestionsByUserId(user_id);
		res.send(suggestions);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateSuggestion = async (req, res) => {
	const data = req.body;
	console.log('data sug', data);

	const { error, value } = createSuggestionSchema.validate(data);

	if (error) {
		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}

	const { user_id, title, description } = value;
	try {
		const suggestion = await createSuggestion({
			user_id,
			title,
			description,
		});
		res.status(201).send(suggestion);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const UpdateSuggestion = async (req, res) => {
	const data = req.body;
	const { error, value } = updateSuggestionSchema.validate(data);

	if (error) {
		console.log(error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}

	const { id, user_id, title, description } = value;
	try {
		const suggestion = await updateSuggestion({
			id,
			user_id,
			title,
			description,
		});
		res.send(suggestion);
	} catch (error) {
		console.log(error);
		if (error.message === 'Suggestion not found') {
			return res.status(404).send('Suggestion not found');
		}
		res.status(500).send('Internal Server Error');
	}
};

export const DeleteSuggestion = async (req, res) => {
	const { id } = req.params;
	try {
		await deleteSuggestion(id);
		res.status(204).send();
	} catch (error) {
		console.log(error);
		if (error.message === 'Suggestion not found') {
			return res.status(404).send('Suggestion not found');
		}
		res.status(500).send('Internal Server Error');
	}
};

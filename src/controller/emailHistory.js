import { createEmailHistorySchema } from '../database/imput_validation/emailHistory.js';
import {
	getAllEmailHistories,
	createEmailHistory,
	deleteEmailHistory,
} from '../database/repositories/emailHistory.js';

export const ListEmailHistories = async (req, res) => {
	try {
		const { user_id } = req.query;
		const emailHistories = await getAllEmailHistories(user_id);
		res.send(emailHistories);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const CreateEmailHistory = async (req, res) => {
	const data = req.body;
	const { error, value } = createEmailHistorySchema.validate(data);
	if (error) {
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
	try {
		const emailHistory = await createEmailHistory(value);
		res.status(201).send(emailHistory);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
};

export const DeleteEmailHistory = async (req, res) => {
	const { id } = req.params;
	try {
		await deleteEmailHistory(id);
		res.status(204).send();
	} catch (error) {
		console.log(error);
		if (error.message === 'Email history not found') {
			return res.status(404).send('Email history not found');
		}
		res.status(500).send('Internal Server Error');
	}
};

import { sendEmailWithAttachment } from '../services/email.js';

export const SendEmailWithFile = async (req, res) => {
	try {
		const { to, subject, text, html } = req.body;
		const files = req.files;

		if (!to || !subject) {
			return res.status(400).send('to and subject are required');
		}

		const attachments = files
			? files.map((file) => ({
					filename: file.originalname,
					content: file.buffer,
			  }))
			: [];

		await sendEmailWithAttachment({
			to,
			subject,
			text,
			html,
			attachments,
		});

		res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).send(`Failed to send email: ${error.message}`);
	}
};
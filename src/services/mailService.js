// src/services/mailService.js
import transporter from '../../config/mailer.js';

/**
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {Array}  options.attachments  - opcional
 */
export async function sendMail({
	to,
	subject,
	html,
	attachments = [],
}) {
	const info = await transporter.sendMail({
		from: process.env.MAIL_FROM,
		to,
		subject,
		html,
		attachments, // nodemailer acepta path, buffer o stream
	});

	return info;
}

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || 'smtp.gmail.com',
	port: process.env.SMTP_PORT || 587,
	secure: process.env.SMTP_PORT === '465',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

export const sendEmailWithAttachment = async ({
	to,
	subject,
	text,
	html,
	attachments,
}) => {
	const mailOptions = {
		from: process.env.SMTP_FROM || process.env.SMTP_USER,
		to,
		subject,
		text,
		html,
		attachments,
	};

	return transporter.sendMail(mailOptions);
};

export default transporter;
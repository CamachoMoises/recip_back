// src/routes/mail.js
import { Router } from 'express';
import multer from 'multer';
import { sendMail } from '../services/mailService.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // en memoria

router.post('/send', upload.single('adjunto'), async (req, res) => {
	try {
		const { to, subject, body } = req.body;

		const attachments = req.file
			? [
					{
						filename: req.file.originalname,
						content: req.file.buffer,
					},
				]
			: [];

		const info = await sendMail({
			to,
			subject,
			html: `<p>${body}</p>`,
			attachments,
		});

		res.json({ ok: true, messageId: info.messageId });
	} catch (error) {
		console.error('Error enviando correo:', error);
		res.status(500).json({ ok: false, error: error.message });
	}
});

export default router;

import express, { json, raw, urlencoded } from 'express';
import cors from 'cors';
import morgan, { token } from 'morgan';
import {
	createParticipant,
	getAllParticipants,
} from './database/repositories/participants.js';
import { createParticipantShema } from './database/imput_validation/participant.js';
import multer from 'multer';
const app = express();
const upload = multer();
app.use(morgan('dev'));
// app.use(
// 	morgan(
// 		':method :url :status :res[content-length] - :response-time ms :body'
// 	)
// );
app.use(urlencoded({ extended: true }));
app.use(json());
// app.use(raw());
// app.use(cors());

app.get('/participants', async (req, res) => {
	try {
		const participants = await getAllParticipants();
		res.send(participants);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/participant', upload.none(), async (req, res) => {
	console.log(req.body, 'ojo');
	req.on('data', (chunk) => {
		console.log('Datos crudos:', chunk.toString());
	});
	const { error, value } = createParticipantShema.validate(req.body);

	if (error) {
		return res.status(400).send('Input Validation Error');
	}
	const { firstName, lastName, docNumber, email, phone } = value;
	try {
		const participant = await createParticipant({
			firstName,
			lastName,
			docNumber,
			email,
			phone,
		});
		res.status(201).send(participant);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
});
export default app;

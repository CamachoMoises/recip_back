import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './route/authentication.js';
import userRoutes from './route/user.js';
import assessmentRoutes from './route/assessment.js';
import moduleRoutes from './route/module.js';
import groupRoutes from './route/group.js';
import groupPermission from './route/permission.js';
import courseRoutes from './route/course.js';
import subjectRoutes from './route/subject.js';
import configRoutes from './route/config.js';
import testRoutes from './route/test.js';
import { v2 as cloudinaryApp } from 'cloudinary';

cloudinaryApp.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
// app.use(raw());

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/permission', groupPermission);
app.use('/api/config', configRoutes);
app.use('/api/test', testRoutes);

// app.get('/participants', async (req, res) => {
// 	try {
// 		const participants = await getAllParticipants();
// 		res.send(participants);
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send('Internal Server Error');
// 	}
// });

// app.post('/participant', upload.none(), async (req, res) => {
// 	console.log(req.body, 'ojo');

// 	// res.status(201).send({ message: 'si que lo erres' });
// 	const { error, value } = createParticipantShema.validate(req.body);

// 	if (error) {
// 		return res.status(400).send('Input Validation Error');
// 	}
// 	const { firstName, lastName, docNumber, email, phone } = value;

// 	try {
// 		const participant = await createParticipant({
// 			firstName,
// 			lastName,
// 			docNumber,
// 			email,
// 			phone,
// 		});
// 		res.status(201).send(participant);
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send('Internal Server Error');
// 	}
// });
// app.get('/participant/:uuid', async (req, res) => {
// 	const uuid = req.params.uuid;
// 	console.log(uuid);
// 	try {
// 		const participant = await getParticipantByUUID({ uuid: uuid });
// 		if (participant) {
// 			return res.status(200).json(participant);
// 		} else {
// 			return res
// 				.status(404)
// 				.json({ message: 'Participant not found' });
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send('Internal Server Error');
// 	}
// });
// app.put('/participant', upload.none(), async (req, res) => {
// 	console.log(req.body, 'ojo');
// 	req.on('data', (chunk) => {
// 		console.log('Datos crudos:', chunk.toString());
// 	});
// 	const { error, value } = createParticipantShema.validate(req.body);

// 	if (error) {
// 		console.log(error);
// 		return res.status(400).send('Input Validation Error');
// 	}
// 	const { firstName, lastName, docNumber, email, phone, uuid } =
// 		value;
// 	try {
// 		const participant = await getParticipantByUUID({
// 			uuid: uuid,
// 		});

// 		if (participant) {
// 			const participantedit = await edictParticipant({
// 				uuid,
// 				newFirstName: firstName,
// 				newLastName: lastName,
// 				newDocNumber: docNumber,
// 				newEmail: email,
// 				newPhone: phone,
// 			});
// 			res.status(201).send(participantedit);
// 		} else {
// 			return res
// 				.status(404)
// 				.json({ message: 'Participant not found' });
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).send('Internal Server Error');
// 	}
// });
export { cloudinaryApp };
export default app;

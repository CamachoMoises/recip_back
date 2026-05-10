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
import emailRoutes from './route/email.js';
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
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'development'
				? '*'
				: [
						'https://recip-kappa.vercel.app/',
						'https://www.recip-kappa.vercel.app/',
						'https://www.recip360atc.com',
						'https://api.recip360atc.com',
						'https://recip360atc.com',
					],
	}),
);
// app.use(raw());

// Status route for server health check
app.get('/status', (req, res) => {
	res.status(200).json({
		status: 'Server is running',
		timestamp: new Date().toISOString(),
	});
});

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
app.use('/api/email', emailRoutes);

app.use(
	'/storage',
	express.static('/home/recipatc/public_html/storage'),
);

export { cloudinaryApp };
export default app;

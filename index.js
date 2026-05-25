import app from './src/app.js';
import { sequelize, setDbConnected } from './src/database/index.js';
import dotenv from 'dotenv';
import { log } from './src/services/logger.js';
import transporter from './config/mailer.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

global.dbConnected = false;
let isReconnecting = false;
transporter.verify((error) => {
	if (error) {
		console.error('❌ SMTP no disponible:', error.message);
	} else {
		console.log('✅ SMTP listo para enviar correos');
	}
});
export async function attemptReconnect() {
	if (isReconnecting || global.dbConnected) {
		return;
	}

	isReconnecting = true;
	log('info', { message: 'Attempting database reconnection...' });

	try {
		await sequelize.authenticate();
		global.dbConnected = true;
		setDbConnected(true);
		log('info', { message: 'Database reconnected successfully' });
	} catch (error) {
		log('error', {
			message: 'Database reconnection failed',
			error: error.message,
		});
		global.dbConnected = false;
		setDbConnected(false);
	} finally {
		isReconnecting = false;
	}
}

async function assertDbConnection() {
	try {
		await sequelize.authenticate();
		global.dbConnected = true;
		setDbConnected(true);
		log('info', { message: 'Database connected successfully' });
	} catch (error) {
		global.dbConnected = false;
		setDbConnected(false);
		log('error', {
			message: 'Database connection failed',
			error: error.message,
		});
	}
}

async function init() {
	await assertDbConnection();

	if (global.dbConnected) {
		try {
			await sequelize.sync({ force: false, alter: false });
			log('info', { message: 'Database sync completed' });
		} catch (error) {
			log('error', {
				message: 'Database sync failed',
				error: error.message,
			});
		}
	}

	app.get('/', (req, res) => {
		//version de la API
		const version = process.env.API_VERSION || '1.0.0';

		res.send(`Proyecto R.E.C.I.P.E. - Backend API v${version}`);
	});

	app.listen(PORT, () => {
		log('info', {
			message: `Server running on http://localhost:${PORT}`,
		});
		console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
	});
}

init();

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { log } from '../services/logger.js';

dotenv.config();

let dbConnectedCallback = null;
let lastDbConnectedState = false;

export function setDbConnected(connected) {
	if (lastDbConnectedState !== connected) {
		lastDbConnectedState = connected;
		global.dbConnected = connected;
		if (dbConnectedCallback) {
			dbConnectedCallback(connected);
		}
	}
}

export function onDbConnectedChange(callback) {
	dbConnectedCallback = callback;
}

// Create Sequelize instance
const sequelize = new Sequelize(
	process.env.DB_NAME_CLEVER,
	process.env.DB_USER_CLEVER,
	process.env.DB_PASSWORD_CLEVER,
	{
		host: process.env.DB_HOST_CLEVER,
		dialect: 'mysql',
		//ver queries en consola
		logging: false,
		port: process.env.DB_PORT_CLEVER,
		define: {
			underscored: true,
		},
		retry: {
			max: 3,
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
);

// Connection event handler
sequelize.afterConnect('main', async (connection, err) => {
	if (err) {
		log('warn', {
			message: 'Database pool connection issue',
			error: err.message,
		});
	} else {
		setDbConnected(true);
		log('info', { message: 'Database connected' });
	}
});

export default sequelize;

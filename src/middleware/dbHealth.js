import { logRequest } from '../services/logger.js';
import { attemptReconnect } from '../../index.js';

const DB_UNAVAILABLE_MESSAGE = 'perdida de conexion con la base de datos';

export function dbHealthMiddleware(req, res, next) {
	if (!global.dbConnected) {
		logRequest(req, 500, DB_UNAVAILABLE_MESSAGE);
		attemptReconnect();
		return res.status(500).json({ error: DB_UNAVAILABLE_MESSAGE });
	}
	next();
}
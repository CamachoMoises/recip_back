import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

function ensureLogDir() {
	if (!fs.existsSync(LOG_DIR)) {
		fs.mkdirSync(LOG_DIR, { recursive: true });
	}
}

function formatLog(level, data) {
	const logEntry = {
		timestamp: new Date().toISOString(),
		level: level.toUpperCase(),
		...data,
	};
	return JSON.stringify(logEntry);
}

export function log(level, data) {
	const logLine = formatLog(level, data);

	console.log(logLine);

	try {
		ensureLogDir();
		fs.appendFileSync(LOG_FILE, logLine + '\n');
	} catch (err) {
		console.error('Error writing to log file:', err);
	}
}

export function logRequest(req, statusCode, errorMessage = null) {
	const logData = {
		method: req.method,
		url: req.originalUrl || req.url,
		ip: req.ip || req.connection?.remoteAddress || 'unknown',
		statusCode,
		message: errorMessage || `Request completed with status ${statusCode}`,
	};

	log(statusCode >= 400 ? 'error' : 'info', logData);
}
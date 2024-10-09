import express, { json, raw, urlencoded } from 'express';
import cors from 'cors';
import morgan, { token } from 'morgan';
const app = express();

token('body', (req) => {
	if (req.body.username) {
		return JSON.stringify(req.body);
	}
	return 'not body';
});
token('url', (req) => {
	return req.url;
});
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body'
	)
);
app.use(json());
app.use(raw());
app.use(urlencoded({ extended: true }));
app.use(cors());

export default app;

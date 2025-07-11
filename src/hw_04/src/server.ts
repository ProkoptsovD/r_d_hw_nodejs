import process from 'node:process';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimiter from 'express-rate-limit';
import morgan from 'morgan';
import pino from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { router as brewsRouter } from './routes/brews.route.ts';
import { scopePerRequest } from 'awilix-express';
import { getConfig } from './config/index.mts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { notFoundHandler } from './middlewares/notFoundHandler.ts';
import { container } from './container.ts';
import { generateSpecs } from './docs/index.ts';

const app = express();
const config = getConfig();

app.use(helmet());
app.use(cors());
app.use(compression());

app.use(
	rateLimiter({
		limit: 10,
		statusCode: 429,
		windowMs: 1000 * 60,
		message: 'Too many requests',
		standardHeaders: true,
		legacyHeaders: false,
	}),
);

app.use(morgan('dev'));
app.use(pino());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(scopePerRequest(container));
app.use('/api', brewsRouter);

if (config.env === 'development') {
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(generateSpecs()));
	console.log(`Swagger docs → ${config.host}:${config.port}/docs`);
}

app.use(notFoundHandler);
app.use(errorHandler);

function bootstap() {
	const server = app.listen(config.port, config.host, () => {
		console.log(`Server started on http://${config.host}:${config.port}`);
	});

	process.once('SIGTERM', terminateServer).once('SIGINT', terminateServer);

	function terminateServer() {
		server.close(() => {
			console.log('Server gracefully shutdown.');
			process.exit(0);
		});
	}
}

bootstap();

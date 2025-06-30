import swaggerJSDoc from 'swagger-jsdoc';
import { getConfig } from '../../config/index.mts';

const config = getConfig();

export const jsdocSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: { title: config.appName, version: config.appVersion },
	},
	apis: ['./src/routes/**/*.ts'],
});

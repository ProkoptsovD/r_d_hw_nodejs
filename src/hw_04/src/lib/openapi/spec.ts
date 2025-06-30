import { registry } from './registry.ts';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { getConfig } from '../../config/index.mts';

export const createZodSpec = () => {
	const config = getConfig();

	const generator = new OpenApiGeneratorV3(registry.definitions);
	const document = generator.generateDocument({
		openapi: '3.0.0',
		info: {
			title: config.appName,
			version: config.appVersion,
		},
	});

	return document;
};

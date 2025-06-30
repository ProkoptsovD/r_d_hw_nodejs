import { z } from 'zod';
import process from 'node:process';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = process.env.APP_ROOT ? join(process.env.APP_ROOT, 'package.json') : join(__dirname, '../../../package.json');
const pkg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const ConfigSchema = z.object({
	PORT: z.number().default(3000),
	HOST: z.string().min(1).default('localhost'),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

let config: NullOr<{ appName: string; appVersion: string; port: number; host: string; env: string }> = null;

export const getConfig = () => {
	if (config) return config;

	const result = ConfigSchema.parse(process.env);

	config = {
		port: result.PORT,
		host: result.HOST,
		env: result.NODE_ENV,
		appName: 'Brews Api',
		appVersion: pkg.version,
	};

	return config;
};

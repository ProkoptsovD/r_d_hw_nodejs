import { z } from 'zod';
import process from 'node:process';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = process.env.APP_ROOT ? join(process.env.APP_ROOT, 'package.json') : join(__dirname, '../../../package.json');
const pkg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const ConfigSchema = z.object({
	port: z.number().default(3000),
	host: z.string().min(1).default('localhost'),
});

let config: NullOr<z.infer<typeof ConfigSchema> & { appName: string; appVersion: string }> = null;

export const getConfig = () => {
	if (config) return config;

	config = {
		...ConfigSchema.parse(process.env),
		appName: 'Brews Api',
		appVersion: pkg.version,
	};

	return config;
};

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = path.join(__dirname, '..', '/database.json');
const dbTestUrl = path.join(__dirname, '..', '/database.test.json');
const isTest = process.env.NODE_ENV === 'test';

const dbConnectionUrl = isTest ? dbTestUrl : dbUrl;

export const config = {
	port: 8081,
	host: 'localhost',
	db: dbConnectionUrl,
};

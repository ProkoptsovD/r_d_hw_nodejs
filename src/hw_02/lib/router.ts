import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { bodyParser } from './body-parser.ts';
import { moduleLoader } from './module-loader.ts';
import { extractParams } from './params-parser.ts';

import type { ServerResponse } from 'node:http';
import type { ExtenedRequest } from '../types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function router(req: ExtenedRequest, res: ServerResponse) {
	const { url, method } = req;

	if (!url) {
		res.writeHead(404);
		return res.end(JSON.stringify({ message: 'Not found' }));
	}
	if (!url.startsWith('/')) {
		res.writeHead(404);
		return res.end(JSON.stringify({ message: 'Not found' }));
	}
	if (!method) {
		res.writeHead(405);
		return res.end(JSON.stringify({ message: 'Method is not allowed' }));
	}

	try {
		const modules = await moduleLoader(path.resolve(__dirname, '../routes'), url);

		const loader = modules?.[url];

		if (!loader) {
			res.writeHead(404);
			return res.end(JSON.stringify({ message: 'Not found' }));
		}

		req.body = await bodyParser(req);
		req.params = extractParams<{ id: string }>(url, loader.fsPath);

		const module = await loader.load();
		const handler = module[method.toUpperCase() as keyof typeof module];

		if (!handler) {
			res.writeHead(405);
			return res.end(JSON.stringify({ message: 'Method is not allowed' }));
		}

		handler(req, res);
	} catch {
		res.writeHead(404);
		res.end(JSON.stringify({ message: 'Not found' }));
	}
}

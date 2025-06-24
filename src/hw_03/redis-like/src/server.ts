import http from 'node:http';
import { URL } from 'node:url';
import { bodyParser } from './body-parser.ts';

const cache = new Map();

const createAccessKey = (method: string, key: string) => {
	return `${method.toUpperCase()} ${key}`;
};

const server = http.createServer((req, res) => {
	const url = new URL(req.url!, 'http://localhost');
	const path = url.searchParams.get('key');

	const handlers: Record<string, AnyFunction> = {
		'GET /get': () => {
			const cached = cache.get(path) ?? null;

			console.log('cached -->', cached);

			return res.end(JSON.stringify({ value: cached }));
		},
		'POST /set': async (request) => {
			const { key, value } = await bodyParser<{ key: string; value: Anything }>(request);
			cache.set(key, value);

			return res.end(JSON.stringify({ ok: true }));
		},
	};

	const key = createAccessKey(req.method!, url.pathname);
	const handler = handlers[key];

	if (!handler) {
		return res.end(JSON.stringify({ message: 'Not found' }));
	}

	handler(req);
});

function startServer() {
	server.listen(4000, () => {
		console.log('server is running on http://localhost:4000');
	});
}

startServer();

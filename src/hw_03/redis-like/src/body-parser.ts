import type { IncomingMessage } from 'node:http';

export const bodyParser = async <T extends Record<string, Anything> = Record<string, Anything>>(req: IncomingMessage) => {
	let body = '';

	for await (const chunk of req) {
		body += chunk;
	}

	try {
		if (!body) return {} as T;

		return JSON.parse(body) as T;
	} catch {
		return {} as T;
	}
};

import type { ServerResponse } from 'node:http';
import type { ExtenedRequest } from '../../types.ts';
import * as usersService from '../../services/user.service.ts';

export async function GET(_: ExtenedRequest, res: ServerResponse) {
	try {
		const users = await usersService.getUsers();
		res.writeHead(200);
		res.end(JSON.stringify({ data: users }));
	} catch {
		res.writeHead(500);
		res.end(JSON.stringify({ message: 'Internal server error' }));
	}
}
export async function POST(req: ExtenedRequest<Anything, { name: string }>, res: ServerResponse) {
	console.log('req.body -->', req.body);
	if (!req.body) {
		res.writeHead(400);
		return res.end(JSON.stringify({ message: 'Bad request' }));
	}
	if (req.body && !req.body.name) {
		res.writeHead(400);
		return res.end(JSON.stringify({ message: 'Name is required field' }));
	}

	try {
		const newUser = await usersService.createUser(req.body);

		res.writeHead(201);
		res.end(JSON.stringify({ data: newUser }));
	} catch {
		res.writeHead(500);
		res.end(JSON.stringify({ message: 'Internal server error' }));
	}
}

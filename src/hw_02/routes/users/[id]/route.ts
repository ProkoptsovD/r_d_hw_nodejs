import type { ServerResponse } from 'node:http';
import type { ExtenedRequest } from '../../../types.ts';
import * as usersService from '../../../services/user.service.ts';

export async function GET(req: ExtenedRequest<{ id: string }>, res: ServerResponse) {
	if (!req.params?.id) {
		res.writeHead(404);
		return res.end(JSON.stringify({ message: 'Not found' }));
	}

	try {
		const user = await usersService.getUserById(req.params.id);

		if (!user) {
			res.writeHead(404);
			return res.end(JSON.stringify({ message: 'Not found' }));
		}

		res.writeHead(200);
		res.end(JSON.stringify({ data: user }));
	} catch {
		res.writeHead(500);
		res.end(JSON.stringify({ message: 'Internal server error' }));
	}
}
export async function PUT(req: ExtenedRequest<{ id: string }, { name?: string }>, res: ServerResponse) {
	if (!req.params?.id) {
		res.writeHead(404);
		return res.end(JSON.stringify({ message: 'Not found' }));
	}
	if (!req.body) {
		res.writeHead(400);
		return res.end(JSON.stringify({ message: 'Bad request' }));
	}

	try {
		const user = await usersService.updateUser({ ...req.body, id: req.params.id });

		if (!user) {
			res.writeHead(400);
			return res.end(JSON.stringify({ message: 'Bad request' }));
		}

		res.writeHead(200);
		res.end(JSON.stringify({ data: user }));
	} catch {
		res.writeHead(500);
		res.end(JSON.stringify({ message: 'Internal server error' }));
	}
}
export async function DELETE(req: ExtenedRequest<{ id: string }>, res: ServerResponse) {
	if (!req.params?.id) {
		res.writeHead(404);
		return res.end(JSON.stringify({ message: 'Not found' }));
	}

	try {
		await usersService.deleteUser(req.params.id);
		res.writeHead(202);
		res.end(JSON.stringify({ data: null }));
	} catch {
		res.writeHead(500);
		res.end(JSON.stringify({ message: 'Internal server error' }));
	}
}

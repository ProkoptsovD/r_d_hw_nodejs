import type { IncomingMessage } from 'node:http';

export type ExtenedRequest<
	P extends Record<string, string> = Record<string, string>,
	B extends Record<string, Anything> = Record<string, Anything>,
> = IncomingMessage & { params?: P; body?: B };

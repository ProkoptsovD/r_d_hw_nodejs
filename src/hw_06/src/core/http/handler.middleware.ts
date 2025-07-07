import type { Request, Response } from 'express';
import type { ArgumentMetadata, ConstructorFn } from '../types/common';

import { runPipes } from '../decorators';
import { METADATA } from '../types/metadata';
import { extractParams } from '../utils/extract';

// class PipeError extends Error {
// 	constructor(message: string) {
// 		super(message);
// 		this.name = 'PipeError';
// 	}
// }

const getHandlerArgs = async (Controller: AnyFunction, handler: AnyFunction, req: Request, globalPipes: Array<ConstructorFn<Anything>>) => {
	const paramMeta: Array<ArgumentMetadata> = Reflect.getMetadata(METADATA.NEST_LIKE_PARAM, Controller) ?? [];
	const methodMeta: Array<ArgumentMetadata> = paramMeta.filter((m) => m.name === handler.name);
	const sortedMeta = [...methodMeta].sort((a, b) => a.index - b.index);
	const args: Anything[] = [];

	for (const metadata of sortedMeta) {
		const extracted = extractParams(req, metadata.type);
		const argument = metadata.data ? extracted[metadata.data] : extracted;

		args[metadata.index] = await runPipes(Controller, handler, argument, metadata, globalPipes);
	}

	return args;
};

export const HandlerMiddleware = (instance: ConstructorFn<Anything>, handler: AnyFunction, globalPipes: Array<ConstructorFn<Anything>>) => {
	return async (req: Request, res: Response) => {
		const constructor = instance.constructor as AnyFunction;
		const args = await getHandlerArgs(constructor, handler, req, globalPipes);

		const result = await handler.apply(instance, args);
		res.json(result);
	};
};

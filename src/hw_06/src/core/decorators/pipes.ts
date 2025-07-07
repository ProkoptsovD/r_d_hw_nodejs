import { isClass } from '../utils/type-guard';
import { METADATA } from '../types/metadata';

import type { Pipe } from '../types/pipes';
import type { ArgumentMetadata } from '../types/common';

export function UsePipes(...pipes: Pipe[]): ClassDecorator & MethodDecorator {
	return (target: Anything, key?: string | symbol) => {
		const destination = key ? target[key] : target;
		Reflect.defineMetadata(METADATA.NEST_LIKE_PIPES, pipes, destination);
	};
}

export function getPipes(handler: AnyFunction, controller: AnyFunction, globalPipes: Pipe[] = []): Pipe[] {
	const classPipes = Reflect.getMetadata(METADATA.NEST_LIKE_PIPES, controller) ?? [];
	const methodPipes = Reflect.getMetadata(METADATA.NEST_LIKE_PIPES, handler) ?? [];
	const paramsPipes = Reflect.getMetadata(METADATA.NEST_LIKE_PARAM_PIPES, handler) ?? [];

	return [...globalPipes, ...classPipes, ...methodPipes, ...paramsPipes];
}

export async function runPipes(controllerClass: AnyFunction, handler: AnyFunction, value: unknown, meta: ArgumentMetadata, globalPipes: Pipe[] = []) {
	const pipes = getPipes(handler, controllerClass, globalPipes);

	let transformed = value;

	for (const PipeController of pipes) {
		const pipeInstance = isClass(PipeController) ? new PipeController() : PipeController;

		transformed = await Promise.resolve(pipeInstance.transform(transformed, meta));
	}
	return transformed;
}

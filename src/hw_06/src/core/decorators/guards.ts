import type { Request, Response } from 'express';
import type { ConstructorFn } from '../types/common';

import { container } from '../container';
import { METADATA } from '../types/metadata';
import { ExpressExecutionContext } from '../utils/execution-context';

export function UseGuards(...guards: Anything[]): ClassDecorator & MethodDecorator {
	return (target: Anything, key?: string | symbol) => {
		if (key) {
			Reflect.defineMetadata(METADATA.NEST_LIKE_GUARDS, guards, target[key]);
		} else {
			Reflect.defineMetadata(METADATA.NEST_LIKE_GUARDS, guards, target);
		}
	};
}

const getGuards = (handler: AnyFunction, controllerClass: ConstructorFn<Anything>, globalGuards: Array<ConstructorFn<Anything>> = []) => {
	const controllerGuards = Reflect.getMetadata(METADATA.NEST_LIKE_GUARDS, controllerClass) ?? [];
	const routeGuards = Reflect.getMetadata(METADATA.NEST_LIKE_GUARDS, handler) ?? [];

	globalGuards.push(...controllerGuards, ...routeGuards);

	return globalGuards;
};

export async function runGuards(
	controllerClass: ConstructorFn<Anything>,
	handler: AnyFunction,
	req: Request,
	res: Response,
	globalGuards: Array<ConstructorFn<Anything>> = [],
): Promise<boolean | string> {
	const guards = getGuards(handler, controllerClass, globalGuards);

	console.log({ guards });

	for (const GuardController of guards) {
		const guard = container.resolve(GuardController);

		const ctx = new ExpressExecutionContext(controllerClass, handler, req, res);
		const can = await Promise.resolve(guard.canActivate(ctx));

		if (!can) {
			return GuardController.name;
		}
	}

	return true;
}

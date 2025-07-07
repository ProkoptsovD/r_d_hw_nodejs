import type { Request, Response } from 'express';
import type { ConstructorFn } from '../types/common';

import { METADATA } from '../types/metadata';
import { ExpressExecutionContext } from '../utils/execution-context';
import { isClass } from '../utils';
import { ExceptionFilter } from '../http/http-exception.filter';
import { HttpException } from '../http';

export function UseFilters(...filters: Anything[]): ClassDecorator & MethodDecorator {
	return (target: Anything, key?: string | symbol) => {
		if (key) {
			Reflect.defineMetadata(METADATA.NEST_LIKE_FILTERS, filters, target[key]);
		} else {
			Reflect.defineMetadata(METADATA.NEST_LIKE_FILTERS, filters, target);
		}
	};
}

const getFilters = (handler: AnyFunction, controllerClass: ConstructorFn<Anything>, globalFilters: Array<ConstructorFn<Anything>> = []) => {
	const controllerFilters = Reflect.getMetadata(METADATA.NEST_LIKE_FILTERS, controllerClass) ?? [];
	const routeFilters = Reflect.getMetadata(METADATA.NEST_LIKE_FILTERS, handler) ?? [];

	globalFilters.push(...controllerFilters, ...routeFilters);

	return globalFilters as Array<ExceptionFilter | ConstructorFn<ExceptionFilter>>;
};

export async function runFilters(
	err: unknown,
	controllerClass: ConstructorFn<Anything>,
	handler: AnyFunction,
	req: Request,
	res: Response,
	globalFilters: Array<ConstructorFn<Anything>> = [],
): Promise<boolean | string> {
	const filters = getFilters(handler, controllerClass, globalFilters);

	console.log({ filters });

	for (const FilterController of filters) {
		const filter: ExceptionFilter = isClass(FilterController) ? new FilterController() : FilterController;

		const ctx = new ExpressExecutionContext(controllerClass, handler, req, res);
		const resolvedErr = err instanceof HttpException ? err : new HttpException('Internal server error', 500);
		filter.catch(resolvedErr, ctx);
	}

	return true;
}

import type { ErrorRequestHandler } from 'express';
import type { ConstructorFn } from '../types/common';
import { runFilters } from '../decorators/filters';

export const FiltersMiddleware = (Controller: ConstructorFn, handler: AnyFunction, filters: Array<ConstructorFn>): ErrorRequestHandler => {
	return (err, req, res, _next) => {
		console.log('here');
		if (!err) {
			return _next();
		}

		if (!filters.length) {
			err.stack = undefined;
			res.status((err as Error & { status: number }).status || 500).json({ error: err.message || 'Server error' });
			return;
		}

		runFilters(err, Controller, handler, req, res, filters);
	};
};

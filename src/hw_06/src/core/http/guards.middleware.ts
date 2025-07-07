import type { NextFunction, Request, Response } from 'express';
import { runGuards } from '../decorators';
import { ConstructorFn } from '../types/common';

export const GuardsMiddleware = (Controller: ConstructorFn<Anything>, handler: AnyFunction, globalGuards: Array<ConstructorFn<Anything>> = []) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const result = await runGuards(Controller, handler, req, res, globalGuards);
		if (typeof result !== 'string') {
			return next();
		}
		res.status(403).json({ message: `Forbidden by ${result}` });
	};
};

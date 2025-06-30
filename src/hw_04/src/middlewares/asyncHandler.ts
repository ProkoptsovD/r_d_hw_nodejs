import type { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: AnyFunction) => (req: Request, res: Response, next: NextFunction) => {
	const result = fn(req, res, next);
	Promise.resolve(result).catch(next);
};

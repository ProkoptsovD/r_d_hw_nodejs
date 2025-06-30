import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validateParams = (schema: ZodSchema) => {
	const handler = (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.params);

		if (!result.success) {
			res.status(400).json({ errors: result.error.format(), where: 'params' });
			return;
		}

		req.params = result.data;
		next();
	};

	return handler;
};

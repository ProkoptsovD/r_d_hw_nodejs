import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
	const handler = (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json({ errors: result.error.format() });
			return;
		}
		req.body = result.data;
		next();
	};

	return handler;
};

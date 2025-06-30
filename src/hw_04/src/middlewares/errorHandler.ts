import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
	const { status = 500, message = 'Internal server error' } = err || {};

	req.log.error(err);
	res.status(status).json({ message });
};

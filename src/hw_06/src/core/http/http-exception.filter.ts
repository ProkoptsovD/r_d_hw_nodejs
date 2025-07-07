import { HttpException } from './exceptions';
import { ExecutionContext } from '../utils';

export interface ExceptionFilter {
	catch(exception: unknown, ctx: ExecutionContext): void;
}

export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, ctx: ExecutionContext) {
		const http = ctx.switchToHttp();
		const response = http.getResponse();
		const request = http.getRequest();
		const status = exception.getStatus();

		let message = '';

		try {
			message = JSON.parse(exception.message);
		} catch {
			message = exception.message;
		}

		response.status(status).json({
			message,
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}

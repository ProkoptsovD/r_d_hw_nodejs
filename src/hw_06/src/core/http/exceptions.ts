export class HttpException extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	public getStatus() {
		return this.statusCode;
	}
}

export class BadRequestException extends HttpException {
	constructor(message = 'Bad Request') {
		super(message, 400);
	}
}

export class UnauthorizedException extends HttpException {
	constructor(message = 'Unauthorized') {
		super(message, 401);
	}
}

export class PaymentRequiredException extends HttpException {
	constructor(message = 'Payment Required') {
		super(message, 402);
	}
}

export class ForbiddenException extends HttpException {
	constructor(message = 'Forbidden') {
		super(message, 403);
	}
}

export class NotFoundException extends HttpException {
	constructor(message = 'Not Found') {
		super(message, 404);
	}
}

export class MethodNotAllowedException extends HttpException {
	constructor(message = 'Method Not Allowed') {
		super(message, 405);
	}
}

export class NotAcceptableException extends HttpException {
	constructor(message = 'Not Acceptable') {
		super(message, 406);
	}
}

export class ProxyAuthRequiredException extends HttpException {
	constructor(message = 'Proxy Authentication Required') {
		super(message, 407);
	}
}

export class RequestTimeoutException extends HttpException {
	constructor(message = 'Request Timeout') {
		super(message, 408);
	}
}

export class ConflictException extends HttpException {
	constructor(message = 'Conflict') {
		super(message, 409);
	}
}

export class GoneException extends HttpException {
	constructor(message = 'Gone') {
		super(message, 410);
	}
}

export class LengthRequiredException extends HttpException {
	constructor(message = 'Length Required') {
		super(message, 411);
	}
}

export class PreconditionFailedException extends HttpException {
	constructor(message = 'Precondition Failed') {
		super(message, 412);
	}
}

export class PayloadTooLargeException extends HttpException {
	constructor(message = 'Payload Too Large') {
		super(message, 413);
	}
}

export class URITooLongException extends HttpException {
	constructor(message = 'URI Too Long') {
		super(message, 414);
	}
}

export class UnsupportedMediaTypeException extends HttpException {
	constructor(message = 'Unsupported Media Type') {
		super(message, 415);
	}
}

export class RangeNotSatisfiableException extends HttpException {
	constructor(message = 'Range Not Satisfiable') {
		super(message, 416);
	}
}

export class ExpectationFailedException extends HttpException {
	constructor(message = 'Expectation Failed') {
		super(message, 417);
	}
}

export class ImATeapotException extends HttpException {
	constructor(message = "I'm a teapot") {
		super(message, 418);
	}
}

export class UnprocessableEntityException extends HttpException {
	constructor(message = 'Unprocessable Entity') {
		super(message, 422);
	}
}

export class TooEarlyException extends HttpException {
	constructor(message = 'Too Early') {
		super(message, 425);
	}
}

export class UpgradeRequiredException extends HttpException {
	constructor(message = 'Upgrade Required') {
		super(message, 426);
	}
}

export class PreconditionRequiredException extends HttpException {
	constructor(message = 'Precondition Required') {
		super(message, 428);
	}
}

export class TooManyRequestsException extends HttpException {
	constructor(message = 'Too Many Requests') {
		super(message, 429);
	}
}

export class RequestHeaderFieldsTooLargeException extends HttpException {
	constructor(message = 'Request Header Fields Too Large') {
		super(message, 431);
	}
}

export class UnavailableForLegalReasonsException extends HttpException {
	constructor(message = 'Unavailable For Legal Reasons') {
		super(message, 451);
	}
}

// SERVER ERRORS - 5xx
export class InternalServerErrorException extends HttpException {
	constructor(message = 'Internal Server Error') {
		super(message, 500);
	}
}

export class NotImplementedException extends HttpException {
	constructor(message = 'Not Implemented') {
		super(message, 501);
	}
}

export class BadGatewayException extends HttpException {
	constructor(message = 'Bad Gateway') {
		super(message, 502);
	}
}

export class ServiceUnavailableException extends HttpException {
	constructor(message = 'Service Unavailable') {
		super(message, 503);
	}
}

export class GatewayTimeoutException extends HttpException {
	constructor(message = 'Gateway Timeout') {
		super(message, 504);
	}
}

export class HTTPVersionNotSupportedException extends HttpException {
	constructor(message = 'HTTP Version Not Supported') {
		super(message, 505);
	}
}

export class NetworkAuthenticationRequiredException extends HttpException {
	constructor(message = 'Network Authentication Required') {
		super(message, 511);
	}
}

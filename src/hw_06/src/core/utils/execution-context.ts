import type { Request, Response } from 'express';
import type { ConstructorFn } from '../types/common';

export interface ExecutionContext {
	getClass(): ConstructorFn<Anything>;
	getHandler(): AnyFunction;

	switchToHttp(): {
		getRequest: () => Request;
		getResponse: () => Response;
	};
}

export class ExpressExecutionContext implements ExecutionContext {
	constructor(
		private readonly targetClass: ConstructorFn<Anything>,
		private readonly targetHandler: AnyFunction,
		private readonly req: Request,
		private readonly res: Response,
	) {}

	getClass(): ConstructorFn<Anything> {
		return this.targetClass;
	}

	getHandler(): AnyFunction {
		return this.targetHandler;
	}

	switchToHttp() {
		return {
			getRequest: () => this.req,
			getResponse: () => this.res,
		};
	}
}

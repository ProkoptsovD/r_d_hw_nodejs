import { Pipe } from '../types/pipes';
import { createParamDecoratorFactory } from '../utils/param-decorator-factory';

export function Param(data?: string, ...pipes: Pipe[]) {
	return createParamDecoratorFactory({ data, type: 'param', pipes });
}

export function Body(...pipes: Pipe[]) {
	return createParamDecoratorFactory({ type: 'body', pipes });
}

export function Query(data: string, ...pipes: Pipe[]) {
	return createParamDecoratorFactory({ data, type: 'query', pipes });
}

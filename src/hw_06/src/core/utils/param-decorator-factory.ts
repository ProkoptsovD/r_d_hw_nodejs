import type { ArgumentMetadata } from '../types/common';
import type { Pipe } from '../types/pipes';
import { METADATA } from '../types/metadata';

type Config = Pick<ArgumentMetadata, 'type' | 'data'> & { pipes?: Pipe[] };

export function createParamDecoratorFactory(config: Config) {
	return function handlerFn<T extends object>(target: T, name: string, idx: number) {
		const argumentParameters = Reflect.getMetadata(METADATA.DESIGN_PARAMTYPES, target, name) ?? [];
		const metatype = argumentParameters[idx];
		const params: Array<ArgumentMetadata> = Reflect.getMetadata(METADATA.NEST_LIKE_PARAM, target.constructor) ?? [];

		params.push({ index: idx, metatype, type: config.type, data: config.data, name });
		Reflect.defineMetadata(METADATA.NEST_LIKE_PARAM, params, target.constructor);

		if (config?.pipes) {
			Reflect.defineMetadata(METADATA.NEST_LIKE_PARAM_PIPES, config.pipes, target, name);
		}
	};
}

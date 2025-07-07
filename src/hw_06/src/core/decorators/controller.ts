import type { ConstructorFn } from '../types/common';
import type { ControllerOptions } from '../types/http';
import { METADATA } from '../types/metadata';

export function Controller(payload: string | ControllerOptions) {
	return function handler(target: ConstructorFn<Anything>) {
		const value = typeof payload === 'string' ? payload : payload.path;
		Reflect.defineMetadata(METADATA.NEST_LIKE_PREFIX, value, target);
	};
}

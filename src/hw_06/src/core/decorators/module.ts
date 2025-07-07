import { ConstructorFn, Metadata } from '../types/common';
import { METADATA } from '../types/metadata';

export function Module<Controller, Provider, Import>(metadata: Metadata<Controller, Provider, Import>) {
	return function handler(target: ConstructorFn) {
		Reflect.defineMetadata(METADATA.NEST_LIKE_MODULE, metadata, target);
	};
}

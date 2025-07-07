import { METADATA } from '../types/metadata';

export function Inject(token?: Anything) {
	return function handler<T extends object>(target: T, _: string | symbol | undefined, idx: number) {
		const params = Reflect.getMetadata(METADATA.NEST_LIKE_INJECT, target) ?? [];
		params[idx] = token;

		Reflect.defineMetadata(METADATA.NEST_LIKE_INJECT, params, target);
	};
}

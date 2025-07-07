import { container } from '../container';
import { ConstructorFn } from '../types/common';

export function Injectable() {
	return function handler(target: ConstructorFn) {
		container.register(target, target);
	};
}

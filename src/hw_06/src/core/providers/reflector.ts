import 'reflect-metadata';
import { Injectable } from '../decorators';
import type { ConstructorFn } from '../types/common';

@Injectable()
export class Reflector {
	public get<Result = Anything, Key = Anything>(metadataKeyOrDecorator: Key, target: ConstructorFn<Anything> | AnyFunction): Result {
		const metadataKey = (metadataKeyOrDecorator as { KEY: string }).KEY ?? metadataKeyOrDecorator;

		return Reflect.getMetadata(metadataKey, target);
	}

	getAllAndOverride<T = Anything>(key: string | symbol, targets: Array<ConstructorFn<Anything> | AnyFunction>): T | undefined {
		for (const target of targets) {
			const value = this.get(key, target);
			if (value !== undefined) return value as T;
		}
		return undefined;
	}
}

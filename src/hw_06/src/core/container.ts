import 'reflect-metadata';
import type { ConstructorFn } from './types/common';

import { METADATA } from './types/metadata';

export class Container {
	private registered = new Map();
	private singletons = new Map();

	public resolve<T>(token: ConstructorFn<T>): T {
		if (this.singletons.has(token)) {
			return this.singletons.get(token);
		}
		const Module = this.registered.get(token);

		if (!Module) {
			throw new Error(`Token ${token.name} is not registered.`);
		}

		const dependencies: ConstructorFn<T>[] = this._getDependencies(Module);

		if (this.getIsTokenBasedObject(Module)) {
			const resolved =
				typeof Module.useClass === 'function'
					? Module.useClass(
							...dependencies.map((dependency) => {
								if (dependency === token) {
									throw new Error(`Circular dependency detected for token ${token.name}.`);
								}

								return this.resolve(dependency);
							}),
					  )
					: Module.useClass;

			this.singletons.set(token, resolved);
			return resolved as T;
		}

		const resolved = new Module(
			...dependencies.map((dependency) => {
				if (dependency === token) {
					throw new Error(`Circular dependency detected for token ${token.name}.`);
				}

				return this.resolve(dependency);
			}),
		);

		this.singletons.set(token, resolved);
		return resolved as T;
	}

	public register<T>(token: ConstructorFn<T> | string, member: T): void {
		if (!this.registered.has(token)) {
			this.registered.set(token, member);
		}
	}

	private _getDependencies<T>(target: ConstructorFn<T>) {
		const dependencies: ConstructorFn<T>[] = Reflect.getMetadata(METADATA.DESIGN_PARAMTYPES, target) || [];
		const injections: ConstructorFn<T>[] = Reflect.getMetadata(METADATA.NEST_LIKE_INJECT, target) || [];

		const resolved = dependencies.map((deps, idx) => {
			const injectedToken = injections[idx] ?? deps;
			const dependency = this.registered.get(injectedToken);

			if (!dependency) {
				throw new Error(`Cannot resolve dependency: ${injectedToken}`);
			}

			return dependency;
		});

		return resolved;
	}

	public getIsTokenBasedObject(target: unknown): target is { useClass: Anything; provide: string } {
		return typeof target === 'object' && target !== null && 'useClass' in target && 'provide' in target;
	}
}

export const container = new Container();

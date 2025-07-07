import type { Paramtype } from '../utils/extract';

export type PromiseFn<T = Anything> = (...args: Anything) => Promise<T>;
export interface ConstructorFn<T = Anything> {
	new (...args: Anything[]): T;
}

export type Metadata<C = Anything, P = Anything, I = Anything, E = Anything> = {
	controllers?: C[];
	providers?: P[];
	imports?: I[];
	exports?: E[];
};

export type ArgumentMetadata = {
	readonly index: number;
	readonly type: Paramtype;
	readonly metatype?: ConstructorFn;
	readonly data?: string;
	readonly name?: string;
};

export type DecoratorHandlerFn<T> = (target: ConstructorFn<T>, name: string, idx: number) => void;

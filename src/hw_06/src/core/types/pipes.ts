import type { ArgumentMetadata, ConstructorFn } from './common';

export interface PipeTransform<Transform = Anything, Result = Anything> {
	transform(value: Transform, metadata: ArgumentMetadata): Result | Promise<Result>;
}

export type Pipe = ConstructorFn<PipeTransform> | InstanceType<ConstructorFn<PipeTransform>>;

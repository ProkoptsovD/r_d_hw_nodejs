import { ConstructorFn } from '../types/common';
import { METADATA } from '../types/metadata';

export const isController = (target: unknown) => typeof target === 'function' && Reflect.hasMetadata(METADATA.NEST_LIKE_PREFIX, target);
export const isClass = <T>(obj: unknown): obj is ConstructorFn<T> => {
	return typeof obj === 'function' && 'prototype' in obj;
};

import type { Express } from 'express';
import { MulterFileSchema } from '../schemas';

export function isArray<T>(v: unknown): v is Array<T> {
  return Array.isArray(v);
}
export function isString(v: unknown): v is string {
  return typeof v === 'string';
}
export function isNumber(v: unknown): v is number {
  return typeof v === 'number';
}
export function isObject(v: unknown): v is object {
  return typeof v === 'object' && !isArray(v) && v !== null;
}
export function isFunction(v: unknown): v is AnyFunction {
  return typeof v === 'function';
}
export function isNullish(v: unknown): v is null | undefined {
  return v === undefined || v === null;
}

export function isMulterFile(v: unknown): v is Express.Multer.File {
  const result = MulterFileSchema.safeParse(v);

  return result.success;
}

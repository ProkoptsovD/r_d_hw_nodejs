import { METADATA } from '../types/metadata';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export function Route(method: Method, path = '') {
	return function <T extends object>(target: T, key: string) {
		const routes = Reflect.getMetadata(METADATA.NEST_LIKE_ROUTES, target.constructor) ?? [];
		routes.push({ method, path, handlerName: key });
		Reflect.defineMetadata(METADATA.NEST_LIKE_ROUTES, routes, target.constructor);
	};
}

export const Get = (path = '') => Route('get', path);
export const Post = (path = '') => Route('post', path);
export const Put = (path = '') => Route('put', path);
export const Patch = (path = '') => Route('patch', path);
export const Delete = (path = '') => Route('delete', path);

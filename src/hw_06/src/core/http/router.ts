import express from 'express';

import { container } from '../container';
import { GuardsMiddleware } from './guards.middleware';
import { HandlerMiddleware } from './handler.middleware';
import { FiltersMiddleware } from './filters.middleware';
import { asyncHandler } from './async-handler';
import { METADATA } from '../types/metadata';

import type { ConstructorFn, PromiseFn } from '../types/common';

const get = Reflect.getMetadata;

export function Factory(...modules: Anything[]) {
	const app = express();

	app.use(express.json());

	const router = express.Router();
	const globalGuards: Array<ConstructorFn<Anything>> = [];
	const globalPipes: Array<ConstructorFn<Anything>> = [];
	const globalFilters: Array<ConstructorFn<Anything>> = [];

	const listen = (port: number, callback?: VoidFunction) => {
		for (const module of modules) {
			const meta = get(METADATA.NEST_LIKE_MODULE, module);

			if (!meta) continue;

			const controllers = meta.controllers ?? [];
			const providers = meta.providers ?? [];
			const imports = meta.imports ?? [];

			for (const Import of imports) {
				if (container.getIsTokenBasedObject(Import)) {
					container.register(Import.provide, Import);
				}
				container.register(Import, Import);
			}

			for (const Provider of providers) {
				if (container.getIsTokenBasedObject(Provider)) {
					container.register(Provider.provide, Provider);
				}
				container.register(Provider, Provider);
			}

			for (const Controller of controllers) {
				container.register(Controller, Controller);
				const prefix = get(METADATA.NEST_LIKE_PREFIX, Controller) ?? '';
				const routes = get(METADATA.NEST_LIKE_ROUTES, Controller) ?? [];

				const instance: InstanceType<typeof Controller> = container.resolve(Controller);

				routes.forEach((route: Anything) => {
					const handler: PromiseFn = instance[route.handlerName];

					const path = prefix + route.path;

					router[route.method as Extract<keyof typeof router, 'get' | 'post' | 'put' | 'pathc' | 'delete'>](
						path,
						asyncHandler(GuardsMiddleware(Controller, handler, globalGuards)),
						asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
						FiltersMiddleware(Controller, handler, globalFilters),
					);
				});
			}
		}

		app.listen(port, callback);
	};

	app.use(router);

	return {
		get: container.resolve,
		listen,
		use: (path: string, handler: express.RequestHandler) => {
			app.use(path, handler);
		},
		useGlobalGuards: (...guards: Anything[]) => {
			globalGuards.push(...guards);
		},
		useGlobalPipes: (...pipes: Anything[]) => {
			globalPipes.push(...pipes);
		},
		useGlobalFilters: (...filters: Anything[]) => {
			globalFilters.push(...filters);
		},
		// useGlobalInterceptors: (interceptors: Anything[]) => {
		// 	throw new Error('Interceptors are not implemented yet');
		// },
	};
}

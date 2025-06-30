import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

declare global {
	interface GlobalThis {
		registry: OpenAPIRegistry;
	}
}

const global = globalThis as unknown as GlobalThis & { registry: OpenAPIRegistry };

extendZodWithOpenApi(z);

if (!global.registry) {
	global.registry = new OpenAPIRegistry();
}

export const registry = global.registry;

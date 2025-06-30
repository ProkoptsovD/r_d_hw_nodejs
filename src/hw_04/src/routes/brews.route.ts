import { Router } from 'express';
import { z } from 'zod';
import { makeClassInvoker } from 'awilix-express';

import { BrewsController } from '../controllers/brews.controller.ts';
import { BrewDTO } from '../dto/BrewDTO.ts';
import { validateParams } from '../middlewares/paramsValidator.ts';
import { validateBody } from '../middlewares/bodyValidator.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { registry } from '../lib/openapi/registry.ts';

const router = Router();
const controller = makeClassInvoker(BrewsController);

const paramsSchema = z.object({
	id: z.string().describe('Brews id'),
});

router.get('/brews', asyncHandler(controller('getAll')));
registry.registerPath({
	method: 'get',
	path: '/api/brews',
	tags: ['Brews'],
	responses: {
		200: {
			description: 'Array of brews',
			content: { 'application/json': { schema: z.array(BrewDTO) } },
		},
	},
});

router.get('/brews/:id', validateParams(paramsSchema), asyncHandler(controller('getOneById')));
registry.registerPath({
	method: 'get',
	path: '/api/brews/{id}',
	tags: ['Brews'],
	request: { params: paramsSchema },
	responses: {
		200: { description: 'Brew', content: { 'application/json': { schema: BrewDTO } } },
		404: { description: 'Brew not found' },
	},
});

router.post('/brews', validateBody(BrewDTO), asyncHandler(controller('createOne')));
registry.registerPath({
	method: 'post',
	path: '/api/brews',
	tags: ['Brews'],
	request: {
		body: { required: true, content: { 'application/json': { schema: BrewDTO } } },
	},
	responses: {
		201: { description: 'Created', content: { 'application/json': { schema: BrewDTO } } },
		400: { description: 'Validation error' },
	},
});

router.put('/brews/:id', validateParams(paramsSchema), validateBody(BrewDTO), asyncHandler(controller('updateOne')));
registry.registerPath({
	method: 'put',
	path: '/api/brews/{id}',
	tags: ['Brews'],
	request: {
		params: paramsSchema,
		body: { required: true, content: { 'application/json': { schema: BrewDTO } } },
	},
	responses: {
		200: { description: 'Updated brew', content: { 'application/json': { schema: BrewDTO } } },
		400: { description: 'Validation error' },
		404: { description: 'Brew not found' },
	},
});

router.delete('/brews/:id', validateParams(paramsSchema), asyncHandler(controller('deleteOne')));
registry.registerPath({
	method: 'delete',
	path: '/api/brews/{id}',
	tags: ['Brews'],
	request: { params: paramsSchema },
	responses: {
		204: { description: 'Deleted' },
		404: { description: 'Brew not found' },
	},
});

export { router };

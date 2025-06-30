import type { RequestHandler, Request } from 'express';
import type { Brew } from '../dto/BrewDTO.ts';

interface BrewsServiceInstance {
	getAll(query?: Request['query']): Promise<Brew[]>;
	getById(id: string): Promise<Brew>;
	create(dto: Anything): Promise<Brew>;
	update(dto: Anything): Promise<Brew>;
	delete(id: string): Promise<void>;
}

export class BrewsController {
	brewsService: BrewsServiceInstance;

	constructor(brewsService: BrewsServiceInstance) {
		this.brewsService = brewsService;
	}

	getAll: RequestHandler = (req, res) => {
		res.json(this.brewsService.getAll(req.query));
	};
	getOneById: RequestHandler = (req, res) => {
		res.json(this.brewsService.getById(req.params.id));
	};
	createOne: RequestHandler = (req, res) => {
		res.json(this.brewsService.create(req.body));
	};
	updateOne: RequestHandler = (req, res) => {
		res.json(this.brewsService.update({ ...req.body, id: req.params.id }));
	};
	deleteOne: RequestHandler = (req, res) => {
		this.brewsService.delete(req.params.id);
		res.status(204).end();
	};
}

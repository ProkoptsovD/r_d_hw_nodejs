import { Product, CreateProductDto, UpdateProductDto } from '../enitities/product';
import { Orm } from '../orm';

interface Logger {
	info(...tokens: unknown[]): void;
}

export class ProductsRepository {
	constructor(private readonly resource: Orm<Product>, private readonly logger: Logger) {}

	async find() {
		const entities = await this.resource.find();
		this.logger.info({ result: entities }, '[GET_ALL]');
		return entities;
	}

	async findOne(id: number) {
		const entity = await this.resource.findOne(id);
		this.logger.info({ result: entity }, '[GET_ONE]');
		return entity;
	}

	async create(dto: CreateProductDto) {
		const entity = await this.resource.save(dto);
		this.logger.info({ result: entity }, '[CREATE]');
		return entity;
	}

	async update(dto: UpdateProductDto) {
		const entity = await this.resource.update(dto.id, dto);
		this.logger.info({ result: entity }, '[UPDATE]');
		return entity;
	}

	async delete(id: number) {
		const entity = await this.resource.delete(id);
		this.logger.info({ result: entity }, '[DELETE]');
		return entity;
	}
}

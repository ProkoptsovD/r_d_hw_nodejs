import { faker } from '@faker-js/faker';

import { Pool } from 'pg';
import { MigrationService, Orm } from './orm';
// import { Orm } from './orm';
import { CreateProductDto, Product } from './enitities/product';
import { ProductsRepository } from './repositories/product.repo';
import pino from 'pino';

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'HH:MM:ss',
			singleLine: false,
		},
	},
});

(async () => {
	let pool: Pool;

	try {
		pool = new Pool({
			host: 'localhost',
			port: 5432,
			user: 'user',
			password: 'userpass',
			database: 'devdb',
		});

		const migration = new MigrationService(pool, console);
		const resource = new Orm<Product>('products', pool);
		const repository = new ProductsRepository(resource, logger);

		await migration.migrate();
		await repository.create(genereteCreateProducts());
		await repository.create(genereteCreateProducts());
		await repository.create(genereteCreateProducts());

		const products = await repository.find();
		const [product] = products;

		await repository.update({ ...product, name: `${product.name} - modfied`, price: 0.01, quantity: 1 });
		await repository.delete(product.id);
		await repository.findOne(product.id);

		await repository.find();
	} catch (error) {
		logger.error(error);
	} finally {
		pool.end();
		logger.info('Pool connection closed');
		process.exit(0);
	}
})();

function genereteCreateProducts(): CreateProductDto {
	return {
		name: faker.commerce.product(),
		price: faker.number.float({ fractionDigits: 2 }),
		quantity: faker.number.float({ fractionDigits: 2 }),
	};
}

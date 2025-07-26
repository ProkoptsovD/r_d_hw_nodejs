import { Pool } from 'pg';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

interface Logger {
	log(...tokens: unknown[]): void;
	error(...tokens: unknown[]): void;
}
export class MigrationService {
	private readonly migrationsDir = resolve(__dirname, '../migrations');

	constructor(private readonly pool: Pool, private readonly logger: Logger) {
		if (!existsSync(this.migrationsDir)) {
			mkdirSync(this.migrationsDir);
		}
	}

	async migrate() {
		const files = (await readdir(this.migrationsDir)).filter((f) => f.endsWith('.sql')).sort();

		for (const file of files) {
			const id = file.split('.', 1)[0];

			this.logger.log(`Applying migration ${id} …`);
			const sql = await readFile(resolve(this.migrationsDir, file), 'utf8');

			await this.pool.query('BEGIN');
			try {
				await this.pool.query(sql);
				await this.pool.query('COMMIT');
				this.logger.log(`✓ ${id} applied`);
			} catch (err) {
				await this.pool.query('ROLLBACK');
				this.logger.error(`✗ ${id} failed`, err as Error);
				throw err;
			}
		}

		this.logger.log('Migrations up-to-date ✅');
	}
}

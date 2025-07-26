import { Pool } from 'pg';

export class Orm<T extends { id: number }> {
	constructor(private table: string, private pool: Pool) {}

	async find(filters?: Partial<T>): Promise<T[]> {
		const whereClause = Orm.toQuerySQLStatement(filters);

		if (!whereClause.statement) {
			const query = await this.pool.query<T>(Orm.SQL`SELECT * FROM ${this.table}`);
			return query.rows;
		}

		const query = await this.pool.query<T>(Orm.SQL`SELECT * FROM ${this.table} WHERE ${whereClause.statement}`, whereClause.parameters);
		return query.rows;
	}

	async findOne(id: T['id']): Promise<T | null> {
		const query = await this.pool.query<T>(Orm.SQL`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
		return query.rows?.[0];
	}
	async save(entity: Omit<T, 'id'>): Promise<T> {
		const insert = Orm.toMutateSQLStatement(entity);

		if (!insert.statement) {
			throw new Error('No data to insert');
		}

		const query = await this.pool.query<T>(
			Orm.SQL`INSERT INTO ${this.table} (${insert.columns}) VALUES (${insert.statement}) RETURNING *`,
			insert.parameters,
		);
		return query.rows?.[0];
	}
	async update(id: T['id'], patch: Partial<T>): Promise<T> {
		const update = Orm.toMutateSQLStatement(patch, { indexOffset: 1, update: true });

		if (!update.statement) {
			throw new Error('No data to update');
		}

		const query = await this.pool.query<T>(`UPDATE ${this.table} SET ${update.statement} WHERE id = $1 RETURNING *`, [id, ...update.parameters]);
		return query.rows?.[0];
	}
	async delete(id: T['id']): Promise<T> {
		const query = await this.pool.query(Orm.SQL`DELETE FROM ${this.table} WHERE id = $1`, [id]);
		return query.rows?.[0];
	}

	private static SQL(tempalteString: TemplateStringsArray, ...values: unknown[]): string {
		const query = tempalteString.reduce((rawQuery, string, index) => {
			const value = values[index] !== undefined ? Orm.sanitize(String(values[index])) : '';

			return `${rawQuery}${string}${value}`;
		}, '');
		return query;
	}
	private static readonly sanitize = (value: string): string => {
		return `${value}`;
	};
	private static readonly toQuerySQLStatement = (filters?: Record<string, unknown>) => {
		if (!filters) return { statement: '', parameters: [] };
		const parameters = [];

		const statement = Object.entries(filters)
			.map(([key, value], index) => {
				parameters.push(value);
				return `${Orm.sanitize(key)} = $${index + 1}`;
			})
			.join(' AND ');

		return {
			statement,
			parameters,
		};
	};

	private static readonly toMutateSQLStatement = (patch: Record<string, unknown>, config?: { indexOffset?: number; update?: boolean }) => {
		if (!patch) return { statement: '', columns: '', parameters: [] };

		const parameters: unknown[] = [];
		const columns = Object.keys(patch ?? {})
			.map(Orm.sanitize)
			.slice(config?.indexOffset ?? 0);
		const columnsString = columns.join(', ');

		let statement = Object.entries(patch ?? {})
			.slice(config?.indexOffset ?? 0)
			.map(([, value], index) => {
				parameters.push(value);
				return `$${index + 1 + (config?.indexOffset ?? 0)}`;
			})
			.join(', ');

		if (config?.update) {
			statement = Object.entries(patch ?? {})
				.slice(config?.indexOffset ?? 0)
				.map(([key], index) => {
					return `${key} = $${index + 1 + (config?.indexOffset ?? 0)}`;
				})
				.join(', ');
		}

		return {
			statement,
			columns: columnsString,
			parameters,
		};
	};
}

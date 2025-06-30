import crypto from 'node:crypto';
import type { Brew } from '../dto/BrewDTO.ts';
import { NotFoundError } from '../utils/error.ts';

export class BrewsService {
	static scope = 'singleton';
	private brews: Map<Brew['id'], Brew>;

	constructor() {
		this.brews = new Map();
	}

	private _toArray<Value>(record: Map<string, Value>): Value[];
	private _toArray<Value>(record: Record<string, Value>): Value[];
	private _toArray<Value>(record: Map<string, Value> | Record<string, Value>): Value[] {
		if (record instanceof Map) {
			return Array.from(record.values());
		}

		return Object.values(record ?? {});
	}
	private _toKeys<T extends Map<string, Anything> | Record<string, Anything>>(record: T) {
		if (record instanceof Map) {
			return Array.from(record.keys());
		}

		return Object.keys(record ?? {});
	}
	private _filter<Value>(brews: typeof this.brews, query: Record<string, Value>) {
		const queryKeys = this._toKeys(query);

		return this._toArray(brews).filter((brew) => {
			return queryKeys.every((key) => {
				if (key !== 'ratingMin') {
					return brew[key as keyof typeof brew] === query[key];
				}

				return brew.rating !== null && brew.rating >= Number(query[key]);
			});
		});
	}
	public getAll = (query: Record<string, string> | undefined) => {
		if (!query) return this._toArray(this.brews);

		return this._filter(this.brews, query);
	};
	public getById = (id: string) => {
		const brew = this.brews.get(id);

		if (!brew) {
			throw NotFoundError('Brew not found');
		}

		return this.brews.get(id);
	};
	public create = (dto: Anything) => {
		const brew: Brew = { id: crypto.randomUUID(), ...dto };
		this.brews.set(brew.id, brew);

		return this.brews.get(brew.id);
	};
	public update = (dto: Anything) => {
		const brew = this.getById(dto.id);

		if (!brew) {
			throw NotFoundError('Brew not found');
		}

		const pathced = { ...brew, ...dto, id: brew.id };
		this.brews.set(pathced.id, pathced);

		return this.brews.get(pathced.id);
	};
	public delete = (id: string) => {
		if (!this.getById(id)) {
			throw NotFoundError('Brew not found');
		}
		this.brews.delete(id);
	};
}

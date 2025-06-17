import path from 'node:path';

import { Database } from './db.ts';
import { uuid } from '../../lib/uuid.ts';
import { formatDate } from '../../lib/date.ts';
import { getTimestamp } from '../helpers/timestamp.ts';

import type { CreateHabitEntityDto, HabitEntity, HabitEntityId, HabitStat, UpdateHabitEntityDto } from '../entities/Habit.ts';

const habitDbConnectionUrl = path.resolve('src', process.cwd(), 'resource', 'database.json');
const statDbConnectionUrl = path.resolve('src', process.cwd(), 'resource', 'complete.json');

const habitDb = new Database<HabitEntity>(habitDbConnectionUrl);
const statDb = new Database<HabitStat>(statDbConnectionUrl);

await Promise.all([habitDb.init(), statDb.init]);

export const getAll = async (): Promise<HabitEntity[]> => {
	return await new Promise((resolve, reject) => {
		const data: HabitEntity[] = [];

		habitDb.on('read', (err, entity) => {
			if (err) {
				return reject(err);
			}

			data.push(entity);
		});

		habitDb.once('end', () => {
			resolve(data);
		});

		habitDb.read();
	});
};

export const getById = async (id: string): Promise<NullOr<HabitEntity>> => {
	return await new Promise((resolve, reject) => {
		let data: NullOr<HabitEntity> = null;

		const onRead = (err: NullOr<Error>, entity: HabitEntity) => {
			if (err) {
				return reject(err);
			}

			if (entity.id !== id) return;

			data = entity;
			habitDb.cancelReading().off('read', onRead);
		};

		habitDb.on('read', onRead);

		habitDb.once('end', () => {
			if (!data) {
				return reject(new Error('Not found'));
			}
			resolve(data);
		});

		habitDb.read();
	});
};

export const create = async (data: CreateHabitEntityDto): Promise<HabitEntity> => {
	return await new Promise((resolve, reject) => {
		habitDb.once('write', (err, entity) => {
			if (err) {
				return reject(err);
			}

			resolve(entity);
		});

		habitDb.write({ id: uuid(), ...data });
	});
};
export const update = async (data: UpdateHabitEntityDto): Promise<NullOr<HabitEntity>> => {
	return await new Promise((resolve, reject) => {
		let entity: NullOr<HabitEntity> = null;

		habitDb.once('update', (err) => {
			if (err) {
				return reject(err);
			}
			if (!entity) {
				return reject(new Error('Not found'));
			}

			resolve(entity);
		});

		habitDb.update((candidate) => {
			if (candidate.id === data.id) {
				entity = {
					...candidate,
					...data,
					modified_at: getTimestamp(),
				};

				return entity;
			}

			return candidate;
		});
	});
};
export const deleteHard = async (id: string): Promise<boolean> => {
	return await new Promise((resolve, reject) => {
		let found = false;
		habitDb.once('delete', (err) => {
			if (err) {
				return reject(err);
			}

			if (!found) {
				return reject(new Error('Not found'));
			}

			resolve(found);
		});

		habitDb.delete((candidate) => {
			if (candidate.id === id) {
				found = true;
				return null;
			}

			return candidate;
		});
	});
};

export const deleteSoft = async (id: string) => {
	const entity = await getById(id);
	return await update({ ...entity, deleted_at: getTimestamp() });
};

export const getStatById = async (id: string, ownerId?: HabitEntityId): Promise<NullOr<HabitStat>> => {
	return await new Promise((resolve, reject) => {
		let data: NullOr<HabitStat> = null;

		const onRead = (err: NullOr<Error>, entity: HabitStat) => {
			if (err) {
				return reject(err);
			}

			if (!ownerId) {
				if (entity.id === id) {
					data = entity;
					statDb.cancelReading().off('read', onRead);
				}
			} else {
				if (entity.id === id && ownerId === entity.habit_id) {
					data = entity;
					statDb.cancelReading().off('read', onRead);
				}
			}
		};

		statDb.on('read', onRead);

		statDb.once('end', () => {
			if (!data) {
				return reject(new Error('Not found'));
			}
			resolve(data);
		});

		statDb.read();
	});
};

export const createStat = async (id: HabitEntityId) => {
	const now = getTimestamp();
	const [statId] = formatDate(now).split(' ');
	let entity: NullOr<HabitStat> = null;

	try {
		entity = await getStatById(statId, id);
	} catch {
		entity = null;
	}

	return new Promise((resolve, reject) => {
		statDb.once('write', (err, data) => {
			if (err) {
				return reject(err);
			}

			resolve(data);
		});

		if (entity) {
			return reject(new Error('You have marked this one as done already'));
		}

		statDb.write({ id: statId, created_at: getTimestamp(), habit_id: id });
	});
};
export const deleteStat = async (id: HabitEntityId, cascade?: boolean) => {
	const now = getTimestamp();
	const [statId] = formatDate(now).split(' ');

	return new Promise((resolve, reject) => {
		let found = false;
		const onDelete = (err: NullOr<Error>) => {
			if (err) {
				return reject(err);
			}

			resolve(found);
			statDb.off('delete', onDelete);
		};
		statDb.on('delete', onDelete);

		statDb.delete((candidate) => {
			if (cascade && candidate.habit_id === id) {
				found = true;
				return null;
			}

			if (!cascade && candidate.habit_id === id && candidate.id === statId) {
				found = true;
				return null;
			}

			return candidate;
		});
	});
};

export const gethabitStats = async (id: HabitEntityId): Promise<HabitStat[]> => {
	return await new Promise((resolve, reject) => {
		const data: HabitStat[] = [];

		statDb.on('read', (err, entity) => {
			if (err) {
				return reject(err);
			}

			if (entity.habit_id === id) {
				data.push(entity);
			}
		});

		statDb.once('end', () => {
			resolve(data);
		});

		statDb.read();
	});
};

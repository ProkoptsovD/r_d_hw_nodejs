import { formatDate, isMonthAgo, isWeekAgo } from '../../lib/date.ts';
import { getTimestamp } from '../helpers/timestamp.ts';

import type {
	CreateHabitEntityDto,
	CreatehabitModelDto,
	HabitEntity,
	HabitEntityId,
	HabitEntityWithStat,
	HabitModel,
	HabitModelDetailed,
	HabitModelWithStat,
	HabitStat,
	UpdateHabitEntityDto,
	UpdatehabitModelDto,
} from '../entities/Habit.ts';
import { isNumber } from '../../lib/type-guards.ts';

type Repository = {
	getAll: () => Promise<HabitEntity[]>;
	getById: (id: string) => Promise<NullOr<HabitEntity>>;
	create: (dto: CreateHabitEntityDto) => Promise<HabitEntity>;
	update: (dto: UpdateHabitEntityDto) => Promise<NullOr<HabitEntity>>;
	deleteHard: (id: string) => Promise<NullOr<boolean>>;
	deleteSoft: (id: string) => Promise<NullOr<HabitEntity>>;
	addStat: (id: string) => Promise<unknown>;
	deleteStat: (id: string, cascade?: boolean) => Promise<unknown>;
	gethabitStats: (id: HabitEntityId) => Promise<HabitStat[]>;
};

export default function createhabitsService({ repository }: { repository: Repository }) {
	const service = {
		getAllhabits: async ({ includeAll = false }: { includeAll?: boolean }) => {
			const result = await repository.getAll();
			const data = [];

			for await (const record of result) {
				const habits = await repository.gethabitStats(record.id);
				const [today] = formatDate(new Date()).split(' ');

				const isDoneForToday = !!habits.find((habit) => habit.id === today);

				if (includeAll) {
					data.push(adaptToHabitModelDetailed(record, isDoneForToday));
				} else {
					data.push(adaptTohabitModel(record, isDoneForToday));
				}
			}

			return data;
		},
		gethabitById: async (id: string) => await repository.getById(id),
		createhabit: async (dto: CreatehabitModelDto) => {
			return await repository.create(adaptToCreateHabitEntityDto(dto));
		},
		updatehabit: async (dto: UpdatehabitModelDto) => {
			return await repository.update(adaptToUpdateHabitEntityDto(dto));
		},
		delete: async (id: string, hard?: boolean) => {
			if (hard) {
				await repository.deleteHard(id);
				const stats = await repository.gethabitStats(id);
				for await (const stat of stats) {
					await repository.deleteStat(stat.habit_id, true);
				}
				return;
			}

			await repository.deleteSoft(id);
		},
		markAsDone: async (id: HabitEntityId) => {
			const record = await service.gethabitById(id);

			if (!record) {
				throw new Error('Not found');
			}

			return await repository.addStat(id);
		},
		getStats: async ({ gte, lte, eq, range }: { gte?: number; lte?: number; eq?: number; range: 'week' | 'month' }) => {
			const habits = await repository.getAll();
			let data = [];

			for await (const habit of habits) {
				const stats = await repository.gethabitStats(habit.id);
				const daysRangeToNumber = {
					week: 7,
					month: 30,
				};
				const rangeInDays = daysRangeToNumber[range] || daysRangeToNumber['week'];

				const result = stats.filter((stat) => {
					if (range === 'week') {
						return isWeekAgo(stat.created_at);
					} else {
						return isMonthAgo(stat.created_at);
					}
				});

				const completion = Math.round((result.length * 100) / rangeInDays);

				data.push({ ...habit, completion });
			}

			if (isNumber(eq)) {
				return data.filter((habit) => habit.completion === eq).map(adaptToHabbitStatModel);
			}

			if (isNumber(gte) && gte >= 0 && isNumber(lte) && lte <= 100) {
				return data.filter((habit) => habit.completion >= gte && habit.completion <= lte).map(adaptToHabbitStatModel);
			}

			if (isNumber(gte) && gte >= 0) {
				data = data.filter((habit) => habit.completion >= gte);
			}
			if (isNumber(lte) && lte <= 100) {
				data = data.filter((habit) => habit.completion <= lte);
			}

			return data.map(adaptToHabbitStatModel);
		},
	};

	return service;
}

function adaptToCreateHabitEntityDto(payload: CreatehabitModelDto): CreateHabitEntityDto {
	return {
		created_at: getTimestamp(),
		deleted_at: null,
		frequency: payload.frequency,
		modified_at: null,
		title: payload.title,
	};
}
function adaptToUpdateHabitEntityDto(payload: UpdatehabitModelDto): UpdateHabitEntityDto {
	return {
		frequency: payload.frequency,
		title: payload.title,
	};
}

function adaptTohabitModel(entity: HabitEntity, isDone: boolean): HabitModel {
	return {
		id: entity.id,
		frequency: entity.frequency,
		title: entity.title,
		createdAt: formatDate(entity.created_at),
		modifiedAt: entity.modified_at ? formatDate(entity.modified_at) : '',
		isDoneForToday: isDone,
	};
}

function adaptToHabitModelDetailed(entity: HabitEntity, isDone: boolean): HabitModelDetailed {
	return {
		...adaptTohabitModel(entity, isDone),
		deletedAt: entity.deleted_at ? formatDate(entity.deleted_at) : '',
	};
}

function adaptToHabbitStatModel(entity: HabitEntityWithStat): HabitModelWithStat {
	return {
		id: entity.id,
		title: entity.title,
		frequency: entity.frequency,
		completion: `${entity.completion}%`,
		createdAt: formatDate(entity.created_at),
	};
}

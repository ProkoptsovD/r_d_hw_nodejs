export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type Timestamp = number;
export type HabitEntityId = string;

export interface HabitEntity {
	id: HabitEntityId;
	created_at: Timestamp;
	modified_at: NullOr<Timestamp>;
	frequency: HabitFrequency;
	deleted_at: NullOr<Timestamp>;
	title: string;
}

export interface HabitStat {
	id: string;
	habit_id: HabitEntityId;
	created_at: Timestamp;
}

export type HabitEntityWithStat = HabitEntity & { completion: number };

export type CreateHabitEntityDto = Omit<HabitEntity, 'id'>;
export type UpdateHabitEntityDto = Partial<HabitEntity>;

export type HabitModel = {
	id: HabitEntityId;
	createdAt: string;
	modifiedAt: NullOr<string>;
	frequency: HabitFrequency;
	title: string;
	isDoneForToday: boolean;
};
export type HabitModelDetailed = HabitModel & {
	deletedAt: NullOr<string>;
};
export type HabitModelWithStat = Pick<HabitModel, 'id' | 'title' | 'frequency' | 'createdAt'> & { completion: string };
export type CreatehabitModelDto = Pick<HabitModel, 'title' | 'frequency'>;
export type UpdatehabitModelDto = Partial<Pick<HabitModel, 'title' | 'frequency' | 'id'>>;

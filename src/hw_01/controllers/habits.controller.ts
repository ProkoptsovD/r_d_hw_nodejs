import { printe, printl, prints, printt } from '../../lib/print.ts';
import { CMD_DEFINITION, type CMD } from '../resource/cmd.ts';

import createhabitsService from '../services/habits.service.ts';
import * as habitsRepository from '../models/habit.ts';

import { type ErrorValidation, validateCmdParams } from '../helpers/validation.ts';
import type { HabitFrequency } from '../entities/Habit.ts';

const { createStat, deleteStat, gethabitStats, ...rest } = habitsRepository;
const repository = {
	...rest,
	addStat: createStat,
	deleteStat,
	gethabitStats,
};

const resource = createhabitsService({ repository });

const add = async (input: string[]) => {
	printProcessing('adding');
	const validation = validateCmdParams<{ freq: HabitFrequency; name: string }>({ input, options: CMD_DEFINITION.add.options });

	if (!validation.success) {
		return printErrors(validation);
	}

	try {
		await resource.createhabit({
			frequency: validation.data.freq,
			title: validation.data.name,
		});

		prints('Added!');
	} catch (error) {
		printe(error);
	}
};
const done = async (input: string[]) => {
	printProcessing('mark as complete');

	const validation = validateCmdParams<{ id: string }>({ input, options: CMD_DEFINITION.done.options });

	if (!validation.success) {
		return printErrors(validation);
	}

	try {
		await resource.markAsDone(validation.data.id);

		prints('Marked as complete!');
	} catch (error) {
		printe((error as Error).message);
	}
};
const list = async (input: string[]) => {
	printProcessing('getting list');

	const validation = validateCmdParams<{ all?: boolean }>({ input, options: CMD_DEFINITION.list.options });

	if (!validation.success) {
		return printErrors(validation);
	}

	const result = await resource.getAllhabits({ includeAll: !!validation.data?.all });
	printt('List of all habits', result);
};
const stats = async (input: string[]) => {
	printProcessing('getting stats');
	const validation = validateCmdParams<Partial<{ gte: string; lte: string; eq: string; range: 'week' | 'month' }>>({
		input,
		options: CMD_DEFINITION.stats.options,
	});

	if (!validation.success) {
		return printErrors(validation);
	}

	const dateRangeDict = {
		week: 'тиждень',
		month: 'місяць',
	};

	const { gte = 0, lte = 100, eq, range = 'week' } = validation.data;
	const payload = { gte: Number(gte), lte: Number(lte), eq: eq ? Number(eq) : undefined, range };
	const result = await resource.getStats(payload);

	printt(`Статистика за ${dateRangeDict[range]}`, result);
};
const update = async (input: string[]) => {
	printProcessing('update');

	const validation = validateCmdParams<Partial<{ freq: HabitFrequency; name: string }> & { id: string }>({
		input,
		options: CMD_DEFINITION.update.options,
	});

	if (!validation.success) {
		return printErrors(validation);
	}

	try {
		const { name, freq, id } = validation.data;

		await resource.updatehabit({
			...(!!name && { title: name }),
			...(!!freq && { frequency: freq }),
			id,
		});

		prints('Modified!');
	} catch (error) {
		printe(error);
	}
};
const remove = async (input: string[]) => {
	printProcessing('delete');

	const validation = validateCmdParams<Partial<{ soft: boolean; hard: boolean }> & { id: string }>({
		input,
		options: CMD_DEFINITION.delete.options,
	});

	if (!validation.success) {
		return printErrors(validation);
	}
	try {
		const { hard, id } = validation.data;
		await resource.delete(id, hard);

		prints('Deleted!');
	} catch (error) {
		printe(error);
	}
};

export const habitsControllerService: Record<CMD, Anything> = {
	add,
	done,
	list,
	stats,
	update,
	delete: remove,
};

function printErrors(validation: ErrorValidation) {
	printe(
		Object.entries(validation.errors)
			.map(([key, err]) => `${key}: ${err.join('\n')}`)
			.join('\n'),
	);
}

function printProcessing(type: string) {
	printl(`Please stand by. Processing ${type}...`);
}

import { getTimestamp } from '../hw_01/helpers/timestamp.ts';

export const formatDate = (date: number | Date) => {
	const now = new Date(date);

	return `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(
		now.getHours(),
	).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

export const isInRange = (date: number | Date, days: number) => {
	const now = getTimestamp();
	const target = new Date(date).getTime();
	const difference = Math.abs(now - target);
	const week = days * 24 * 60 * 60 * 1000;

	return difference <= week;
};

export const isWeekAgo = (date: number | Date) => isInRange(date, 7);
export const isMonthAgo = (date: number | Date) => isInRange(date, 30);

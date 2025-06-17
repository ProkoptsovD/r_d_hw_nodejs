export const getTimestamp = () => {
	const now = Date.now();
	const offset = Number(process.env['DAY_OFFSET']);
	const offsetInDays = isNaN(offset) ? 0 : offset;
	const offsetInMiliseconds = offsetInDays * 24 * 60 * 60 * 1000;

	return now + offsetInMiliseconds;
};

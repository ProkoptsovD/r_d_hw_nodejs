export function printl(...params: unknown[]) {
	console.log(`${'\x1b[44m\x1b[37m'}${params.join(' ')}\x1b[0m`);
}
export function printe(...params: unknown[]) {
	console.error(`${'\x1b[41m\x1b[37m'}${params.join(' ')}\x1b[0m`);
}
export function prints(...params: unknown[]) {
	console.log(`\x1b[42m\x1b[30m ${params.join(' ')} \x1b[0m`);
}
export function printt(title: string, data: unknown): void {
	console.log(`\n\x1b[45m\x1b[30m ${title} \x1b[0m`);
	console.table(data);
}

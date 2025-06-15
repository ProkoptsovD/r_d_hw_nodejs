function printl(...params) {
	console.log(`${'\x1b[44m\x1b[37m'}${params.join(' ')}\x1b[0m`);
}
function printe(...params) {
	console.error(`${'\x1b[41m\x1b[37m'}${params.join(' ')}\x1b[0m`);
}

module.exports = {
	printl,
	printe,
};

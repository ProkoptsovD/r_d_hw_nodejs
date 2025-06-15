const { argv } = require('node:process');

const { sum } = require('./helpers/math');
const { tryCatch } = require('./helpers/try-catch');
const { printe, printl } = require('../lib/print');

function getArgs() {
	const args = argv[2] ?? [];
	const { data, error } = tryCatch(() => JSON.parse(args));

	if (error) {
		printe('Input is malformed.\nPlease, enter valid JSON string that represents an array, e.g "[1, 2, 3]"');
		process.exit(0);
	}

	return data;
}

function main() {
	const nums = getArgs();
	const total = sum(nums);

	printl('Сума чисел: ', `${total}`);
}

main();

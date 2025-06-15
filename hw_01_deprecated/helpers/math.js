const { isString, isNumber, isArray } = require('../../lib/type-guards');

function sum(nums) {
	let total = 0;

	if (!isArray(nums)) {
		return total;
	}

	nums.forEach((num) => {
		if (isArray(num)) {
			total += sum(num);
		}
		if (isString(num)) {
			total += Number(num);
		}
		if (isNumber(num)) {
			total += num;
		}
	});

	return total;
}

module.exports = {
	sum,
};

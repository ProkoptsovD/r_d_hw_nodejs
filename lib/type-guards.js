function isArray(v) {
	return Array.isArray(v);
}
function isString(v) {
	return typeof v === 'string';
}
function isNumber(v) {
	return typeof v === 'number';
}
function isObject(v) {
	return typeof v === 'object' && !isArray(v) && v !== null;
}
function isFunction(v) {
	return isObject(v) && !!v.constructor && !!v.call && !!v.apply;
}
function isThenable(v) {
	return isObject(v) && isFunction(v.then);
}
function isPromise(v) {
	return v instanceof Promise;
}
function isPromiseLike(v) {
	return isPromise(v) || isThenable(v);
}
function isNullish(v) {
	return v === undefined || v === null;
}

module.exports = {
	isArray,
	isString,
	isNumber,
	isPromiseLike,
	isObject,
	isThenable,
	isPromise,
	isFunction,
	isNullish,
};

function constructSussfullResponse(v) {
	return {
		data: v,
		error: null,
	};
}
function constructErrorResponse(v) {
	return {
		data: null,
		error: v,
	};
}

function tryCatch(callback) {
	try {
		const result = callback();
		return constructSussfullResponse(result);
	} catch (error) {
		return constructErrorResponse(error);
	}
}

module.exports = {
	tryCatch,
};

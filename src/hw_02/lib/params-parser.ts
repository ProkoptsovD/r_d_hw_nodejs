export const extractParams = <P extends Record<string, Anything> = Record<string, Anything>>(route: string, fsPath: string) => {
	const routeSegments = route.startsWith('/') ? route.slice(1).split('/') : route.split('/');
	const fsSegments = fsPath.split('/');
	const params: Record<string, Anything> = {};

	if (routeSegments.length !== fsSegments.length) {
		return {} as P;
	}

	fsSegments.forEach((fsSegments, index) => {
		const requestUrlSegment = routeSegments[index];

		if (fsSegments.startsWith(':')) {
			const paramName = fsSegments.slice(1);
			params[paramName] = requestUrlSegment;
		}
	});

	return params as P;
};

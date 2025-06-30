export function NotFoundError(msg: string) {
	return Object.assign(new Error(msg), { status: 404 });
}

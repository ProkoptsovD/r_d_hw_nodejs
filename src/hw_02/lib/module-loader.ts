import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const matchRoute = (url: string, route: string) => {
	const urlSegments = url.split('/').filter(Boolean);
	const fsSegments = route.split('/').filter(Boolean);

	if (urlSegments.length !== fsSegments.length) return false;

	for (let i = 0; i < fsSegments.length; i++) {
		const fsPart = fsSegments[i];
		const urlPart = urlSegments[i];

		if (!fsPart.startsWith(':') && fsPart !== urlPart) {
			return false;
		}
	}
	return true;
};

export const moduleLoader = async (dir: string, url: string) => {
	let segments = {} as {
		[key: string]: {
			load: () => Promise<Anything>;
			fsPath: string;
		};
	};

	try {
		const files = await fs.readdir(dir, { recursive: true });

		for (const filename of files) {
			if (!filename.endsWith('route.ts')) continue;
			const routePath = filename.slice(0, -'route.ts'.length);

			const route = routePath
				.split(path.sep)
				.filter(Boolean)
				.map((part) => {
					return part.startsWith('[') && part.endsWith(']') ? `:${part.slice(1, -1)}` : part;
				})
				.join('/');

			if (matchRoute(url, route)) {
				segments = {
					...segments,
					[url]: {
						load: () => {
							const fullpath = path.join(dir, filename);
							const importUrl = pathToFileURL(fullpath).href;

							return import(importUrl);
						},
						fsPath: route,
					},
				};
			}
		}

		return segments;
	} catch {
		return {};
	}
};

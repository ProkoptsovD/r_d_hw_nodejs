export function mergeSpecs(target: Record<string, Anything>, source: Record<string, Anything>) {
	target.paths = Object.assign({}, target.paths, source.paths);

	target.components ??= {};
	target.components.schemas ??= {};

	if (source.components?.schemas) {
		target.components.schemas = Object.assign({}, target.components.schemas, source.components.schemas);
	}

	if (source.tags) {
		const tagNames = new Set(target.tags?.map((t: Anything) => t.name) ?? []);
		target.tags = [...(target.tags ?? []), ...source.tags.filter((t: Anything) => !tagNames.has(t.name))];
	}

	return target;
}

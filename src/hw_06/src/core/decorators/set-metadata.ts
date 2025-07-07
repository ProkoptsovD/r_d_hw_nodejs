export type CustomDecorator<TKey = string> = MethodDecorator &
	ClassDecorator & {
		KEY: TKey;
	};

export const SetMetadata: <K = string, V = Anything>(metadataKey: K, metadataValue: V) => CustomDecorator<K> = (metadataKey, metadataValue) => {
	const definition = (target: object, _?: Anything, descriptor?: Anything) => {
		if (descriptor) {
			Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
			return descriptor;
		}
		Reflect.defineMetadata(metadataKey, metadataValue, target);
		return target;
	};

	definition.KEY = metadataKey;
	return definition;
};

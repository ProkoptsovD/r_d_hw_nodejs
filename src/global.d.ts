// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Anything = any;
type AnyFunction<T = Anything> = (...args: Anything[]) => T;
type NullOr<T> = T | null;

type RemoveUnderscoreFirstLetter<S extends string> = S extends `_${infer U}` ? U : S;

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends MyCapitalize<T> ? '_' : ''}${RemoveUnderscoreFirstLetter<Lowercase<T>>}${CamelToSnakeCase<U>}`
	: S;

type MyCapitalize<S extends string> = S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S;

type SnakeToCamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
	? `${Lowercase<First>}${MyCapitalize<SnakeToCamelCase<Rest>>}`
	: Lowercase<S>;

type SnakeCase<T> = {
	[K in keyof T as CamelToSnakeCase<K & string>]: T[K];
};

type CamelCase<T> = {
	[K in keyof T as SnakeToCamelCase<K & string>]: T[K];
};

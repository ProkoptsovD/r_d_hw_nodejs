/* eslint-disable @typescript-eslint/no-explicit-any */
export type Prettify<T> = {
	[K in keyof T]: T[K] extends InstanceType<new (...args: any[]) => any> ? T[K] : T[K] extends object ? Prettify<T[K]> : T[K];
};

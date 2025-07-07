export class ConfigModule {
	static forRoot({ options, provide = 'CONFIG_OPTIONS' }: { options: Record<string, Anything>; provide?: string }) {
		const rec = {
			provide,
			useClass: () => options,
		};

		return rec;
	}
}

import { createContainer, asClass } from 'awilix';
import { objectMap } from './utils/structure.ts';
import { BrewsController } from './controllers/brews.controller.ts';
import { BrewsService } from './services/brews.service.ts';

type ScopeKey = keyof Pick<typeof asClass.prototype, 'scoped' | 'singleton' | 'transient'>;

const brewsModule = {
	brewsService: BrewsService,
	brewsController: BrewsController,
};

export const container = createContainer({ injectionMode: 'CLASSIC' }).register(
	objectMap(brewsModule, (value) => {
		const builder = asClass(value);
		const scope = (value as { scope?: ScopeKey }).scope ?? 'transient';

		if (typeof builder[scope] === 'function') {
			return builder[scope]();
		}

		return builder;
	}),
);

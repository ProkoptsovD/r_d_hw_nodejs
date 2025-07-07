import { Inject, Injectable } from '../..//core/decorators';
import type { Config } from '../config';

@Injectable()
export class ConfigService {
	constructor(@Inject('CONFIG_OPTIONS') private options: Config) {
		console.log('options -->', options);
	}

	get(key: keyof Config): Config[keyof Config] {
		return this.options[key];
	}
}

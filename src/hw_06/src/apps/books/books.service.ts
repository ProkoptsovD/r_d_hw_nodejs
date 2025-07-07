import { Inject, Injectable } from '../../core/decorators';
import { ConfigService } from './config.service';

export interface Book {
	id: number;
	title: string;
}

@Injectable()
export class BooksService {
	#data: Book[] = [{ id: 1, title: '1984' }];

	constructor(@Inject(ConfigService) private config: ConfigService) {
		console.log('config.host -->', this.config.get('HOST'));
	}

	findAll() {
		return this.#data;
	}
	findOne(id: number) {
		return this.#data.find((b) => b.id === id);
	}

	create(title: string) {
		const book = { id: Date.now(), title };
		this.#data.push(book);
		return book;
	}
}

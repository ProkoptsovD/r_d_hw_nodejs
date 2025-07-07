import { Module } from '../../core/decorators';

import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { booksSchema } from './books.schema';
import { ConfigModule } from '../../core/decorators/config';
import { config } from '../config';

@Module({
	imports: [ConfigModule.forRoot({ options: config })],
	controllers: [BooksController],
	providers: [BooksService, { provide: 'pipe', useClass: () => new ZodValidationPipe(booksSchema) }],
})
export class BooksModule {}

import 'reflect-metadata';
import { BooksModule } from './apps/books/books.module';
import { Factory } from './core/http';
import { HttpExceptionFilter } from './core/http/http-exception.filter';

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

const app = Factory(BooksModule);

app.useGlobalFilters(HttpExceptionFilter);

const port = 8081;

app.listen(port, () => console.log(`Mini-Nest listening on http://localhost:${port}`));

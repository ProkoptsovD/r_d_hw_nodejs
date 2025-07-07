import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '../../core/decorators';

import { BooksService } from './books.service';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { Roles, RolesGuard } from '../guards/role.guard';
import { booksSchema } from './books.schema';

@Controller('/books')
@UseGuards(RolesGuard)
export class BooksController {
	constructor(private svc: BooksService) {}

	@Get('/')
	@Roles('admin')
	list() {
		return this.svc.findAll();
	}

	@Get('/:id')
	one(@Param('id') id: string) {
		return this.svc.findOne(+id);
	}

	@Post('/')
	@UsePipes(new ZodValidationPipe(booksSchema))
	add(@Body() body: { title: string }) {
		return this.svc.create(body.title);
	}
}

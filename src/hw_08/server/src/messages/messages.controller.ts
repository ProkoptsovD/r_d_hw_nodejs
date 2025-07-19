import { Body, Controller, DefaultValuePipe, Get, Headers, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MessageDTO } from '../dto';
import { MessageService } from './message.service';

@Controller('/api/chats/:id/messages')
export class MessagesController {
	constructor(private messageService: MessageService) {}

	@Get()
	async list(
		@Headers('X-User') user: string,
		@Param('id') chatId: string,
		@Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
		@Query('cursor') cursor?: string,
	): Promise<{ items: MessageDTO[]; nextCursor?: string }> {
		const messages = await this.messageService.getMessages(chatId, { cursor, limit });
		const nextCursor = messages.length === limit ? messages[messages.length - 1].sentAt : undefined;

		return { items: messages, nextCursor };
	}

	@Post()
	async create(@Headers('X-User') author: string, @Param('id') chatId: string, @Body('text') text: string): Promise<MessageDTO> {
		return await this.messageService.saveMessage(chatId, {
			author,
			text,
		});
	}
}

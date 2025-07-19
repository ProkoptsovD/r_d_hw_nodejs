import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { ChatDTO } from '../dto';
import { ChatsService } from './chats.service';

@Controller('/api/chats')
export class ChatsController {
	constructor(private chatService: ChatsService) {}

	@Post('/')
	async create(@Headers('X-User') creator: string, @Body() body: { name?: string; members: string[] }): Promise<ChatDTO | null> {
		const chat = await this.chatService.createChat(body, creator);
		return chat;
	}

	@Get('/')
	async list(@Headers('X-User') user: string) {
		const chats = await this.chatService.getChatsByUser(user);

		return {
			items: chats,
			total: chats.length,
		};
	}

	@Patch(':id/members')
	async patch(@Headers('X-User') actor: string, @Param('id') id: string, @Body() dto: { add?: string[]; remove?: string[] }) {
		const updated = await this.chatService.updateMembers(id, dto.add, dto.remove);
		return updated;
	}

	@Delete(':id')
	async delete(@Headers('X-User') admin: string, @Param('id') id: string) {
		return await this.chatService.deleteChat(id, admin);
	}
}

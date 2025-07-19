import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MessageDTO } from 'src/dto';
import { Store } from 'src/store/store';

@Injectable()
export class MessageService {
	constructor(private readonly store: Store) {}

	async getMessages(chatId: string, options: { cursor?: string; limit: number }): Promise<MessageDTO[]> {
		const messages = await this.store.getChatMessages(chatId);

		const sorted = messages.filter((m) => m.chatId === chatId).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
		const filtered = options.cursor ? sorted.filter((m) => new Date(m.sentAt) < new Date(options?.cursor ?? '')) : sorted;
		const page = filtered.slice(0, options?.limit);

		return page;
	}

	async saveMessage(chatId: string, dto: Omit<MessageDTO, 'id' | 'sentAt' | 'chatId'>): Promise<MessageDTO> {
		const message: MessageDTO = {
			id: randomUUID(),
			chatId,
			sentAt: new Date().toISOString(),
			...dto,
		};

		return await this.store.createChatMessage(chatId, message);
	}
}

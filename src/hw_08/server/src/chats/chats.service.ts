import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatDTO } from 'src/dto';
import { Store } from 'src/store/store';

@Injectable()
export class ChatsService {
	constructor(private readonly store: Store) {}

	async createChat(dto: Pick<ChatDTO, 'members'> & { name?: string }, creator: string) {
		if (!dto.members.includes(creator)) {
			dto.members.push(creator);
		}
		const chat = {
			...dto,
			creator,
			name: dto.name ?? [...new Set(dto.members.map((member) => member?.toLowerCase()))].join(' & '),
		};
		return await this.store.createChat(chat);
	}

	async getChatsByUser(user: string): Promise<ChatDTO[]> {
		return (await this.store.getUserChats(user)) ?? [];
	}

	async getChatById(id: string): Promise<NullOr<ChatDTO>> {
		const chat = await this.store.getChat(id);

		return chat;
	}

	async updateMembers(id: string, add?: string[], remove?: string[]): Promise<ChatDTO | null> {
		const chat = await this.store.getChat(id);

		if (!chat) {
			throw new NotFoundException(`Chat with id ${id} not found`);
		}

		const currentMembers = new Set([...chat.members, ...(add ?? [])]);
		const removeCanidates = new Set(remove?.map((m) => m.toLowerCase()) ?? []);
		const members = Array.from(currentMembers).filter((m) => !removeCanidates.has(m.toLowerCase()));

		return await this.store.updateChat(id, { ...chat, members });
	}

	async deleteChat(id: string, creator: string): Promise<void> {
		const chat = await this.store.getChat(id);

		if (!chat) {
			throw new NotFoundException(`Chat with id ${id} not found`);
		}
		if (chat.creator !== creator) {
			throw new ForbiddenException(`Chat with id ${id} not found or you are not the creator`);
		}

		await this.store.deleteChat(id);
	}
}

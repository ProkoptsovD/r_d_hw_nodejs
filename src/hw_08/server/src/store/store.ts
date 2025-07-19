import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import type { ChatDTO, MessageDTO, UserDTO } from 'src/dto';

const resolveTablePath = (table: string): string => {
	return path.resolve(__dirname, './', table + '.json');
};

type SelectFromOptions<T extends object> = {
	where?: Partial<T>;
};

@Injectable()
export class Store implements OnModuleInit {
	private readonly usersTable = resolveTablePath('users');
	private readonly chatsTable = resolveTablePath('chats');
	private readonly messagesTable = resolveTablePath('messages');

	constructor() {}

	async onModuleInit() {
		await Promise.all([this.usersTable, this.chatsTable, this.messagesTable].map(this._createTable));
	}

	// USERS
	async getAllUsers() {
		return await this.selectFrom<UserDTO>(this.usersTable);
	}
	async getUser(name: string): Promise<UserDTO | null> {
		const users = await this.selectFrom<UserDTO>(this.usersTable, { where: { name } });
		const [user] = users || [];

		return user || null;
	}
	async createUser(dto: Omit<UserDTO, 'id'>) {
		let users = await this.selectFrom<UserDTO>(this.usersTable);

		if (!users) {
			users = [] as UserDTO[];
		}

		const user: UserDTO = {
			id: randomUUID(),
			...dto,
		};

		users.push(user);
		await this.write(this.usersTable, users);
		return await this.getUser(user.name);
	}

	// CHATS
	async getChat(id: string): Promise<ChatDTO | null> {
		const chats = await this.selectFrom<ChatDTO>(this.chatsTable, { where: { id } });
		const [chat] = chats || [];

		return chat || null;
	}
	async getUserChats(username: string): Promise<ChatDTO[]> {
		const chats = await this.selectFrom<ChatDTO>(this.chatsTable);
		const userChats = chats?.filter((c) => c.members.includes(username)) ?? ([] as ChatDTO[]);

		return userChats;
	}
	async createChat(dto: Omit<ChatDTO, 'id' | 'updatedAt'>) {
		let chats = await this.selectFrom<ChatDTO>(this.chatsTable);

		if (!chats) {
			chats = [] as ChatDTO[];
		}

		const chat: ChatDTO = {
			id: randomUUID(),
			updatedAt: new Date().toISOString(),
			...dto,
		};

		chats.push(chat);
		await this.write(this.chatsTable, chats);
		return await this.getChat(chat.id);
	}
	async updateChat(id: string, dto: Partial<Omit<ChatDTO, 'id'>>) {
		const chats = await this.selectFrom<ChatDTO>(this.chatsTable);
		const updated =
			chats?.map((chat) => {
				if (chat.id !== id) return chat;

				return {
					...chat,
					...dto,
					updatedAt: new Date().toISOString(),
					id: chat.id,
				};
			}) ?? [];

		await this.write(this.chatsTable, updated);
		return await this.getChat(id);
	}

	async deleteChat(id: string) {
		const chats = await this.selectFrom<ChatDTO>(this.chatsTable);

		if (!chats) return;

		const filtered = chats.filter((chat) => chat.id !== id);
		await this.write(this.chatsTable, filtered);
	}

	// MESSAGES
	async getChatMessages(chatId: string) {
		const messages = await this.selectFrom<MessageDTO>(this.messagesTable);
		if (!messages) return [] as MessageDTO[];

		return messages.filter((message) => message.chatId === chatId);
	}
	async createChatMessage(chatId: string, dto: Omit<MessageDTO, 'id'>) {
		let messages = await this.selectFrom<MessageDTO>(this.messagesTable);
		const message: MessageDTO = {
			id: randomUUID(),
			...dto,
			chatId,
		};

		if (!messages) {
			messages = [] as MessageDTO[];
		}

		messages.push(message);

		await this.write(this.messagesTable, messages);
		return message;
	}

	// internal methods
	private async _createTable(table: string) {
		try {
			await fsp.stat(table);
		} catch {
			await fsp.writeFile(table, '[]\n', { encoding: 'utf-8', flag: 'w' });
		}
	}

	private async selectFrom<T extends object>(table: string, options?: SelectFromOptions<T>): Promise<T[] | null> {
		try {
			const file = await fsp.readFile(table, { encoding: 'utf-8' });
			const json = JSON.parse(file);

			if (!options?.where) return json as T[];

			const filtered = json.filter((entity: Anything) =>
				Object.entries(options.where ?? {}).every(([key, value]) => (entity as Anything)[key] === value),
			);

			return filtered as T[];
		} catch {
			return null;
		}
	}

	private async write<T>(table: string, data: T): Promise<boolean> {
		try {
			const content = Array.isArray(data) ? data : [data];
			await fsp.writeFile(table, JSON.stringify(content), { encoding: 'utf-8' });
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}
}

export interface UserDTO {
	id: string;
	name: string;
	iconUrl: string | null;
}

export interface ChatDTO {
	id: string;
	name: string;
	members: string[];
	updatedAt: string;
	creator: string;
}

export interface MessageDTO {
	id: string;
	chatId: string;
	author: string;
	text: string;
	sentAt: string;
}

export interface UpdateChatMembersDTO {
	add: string[];
	remove: string[];
}

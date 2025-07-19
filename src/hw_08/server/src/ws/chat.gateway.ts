import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { OnModuleDestroy } from '@nestjs/common';
import { MessageService } from 'src/messages/message.service';
import { ChatsService } from 'src/chats/chats.service';

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки
@WebSocketGateway({ path: '/ws', cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
	private readonly sub: Redis;
	private event$ = new Subject<{ ev: string; data: Anything; meta?: Anything }>();

	constructor(private messageService: MessageService, private chatService: ChatsService, private readonly redis: Redis) {
		this.sub = this.redis.duplicate();

		this.sub.subscribe('chat-events');
		this.sub.on('message', (_, raw) => {
			const parsed = JSON.parse(raw);
			if (parsed.src === INSTANCE_ID) return; // ⬅️ skip own
			console.log('Received event:', parsed);
			this.event$.next(parsed);
		});

		this.event$
			.pipe(filter((e) => e.meta?.local))
			.subscribe((e) => this.redis.publish('chat-events', JSON.stringify({ ...e, meta: undefined, src: INSTANCE_ID })));
	}

	onModuleDestroy() {
		this.sub.disconnect();
		this.redis.disconnect();
	}

	handleConnection(client: Socket) {
		const user = client.handshake.auth?.user as string;

		if (!user) return client.disconnect(true);

		client.data.user = user;

		// Subscribe to forwarded events for this connection
		const subscription = this.event$
			.pipe(
				filter(({ data }) => data?.user === user || data?.author === user),
				filter(({ data }) => data?.members?.includes(user) || data?.chatId === client?.data?.chatId),
			)
			.subscribe((event) => {
				client.emit(event.ev, event.data);
			});

		client.on('disconnect', () => {
			subscription.unsubscribe();
		});
	}

	@SubscribeMessage('join')
	async onJoin(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string }) {
		const user = client.data.user;
		const { chatId } = body;

		const chat = await this.chatService.updateMembers(chatId, [user], []);

		this.event$.next({
			ev: 'chatCreated',
			data: chat,
			meta: { local: true },
		});
	}

	@SubscribeMessage('leave')
	async onLeave(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string }) {
		const user = client.data.user;
		const { chatId } = body;

		const chat = await this.chatService.updateMembers(chatId, [], [user]);

		this.event$.next({
			ev: 'membersUpdated',
			data: chat,
			meta: { local: true },
		});
	}

	@SubscribeMessage('send')
	async onSend(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string; text: string }) {
		const user = client.data.user;

		const message = {
			author: user,
			text: body.text,
		};

		const created = await this.messageService.saveMessage(body.chatId, message);
		this.event$.next({
			ev: 'message',
			data: created,
			meta: { local: true },
		});
	}

	@SubscribeMessage('typing')
	onTyping(@ConnectedSocket() client: Socket, @MessageBody() body: { chatId: string; isTyping: boolean }) {
		const user = client.data.user;

		this.event$.next({
			ev: 'typing',
			data: { user, chatId: body.chatId, isTyping: body.isTyping },
			meta: { local: true },
		});
	}
}

import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ChatGateway } from './chat.gateway';
import { ChatsService } from 'src/chats/chats.service';
import { MessageService } from 'src/messages/message.service';
import { Store } from 'src/store/store';
import { FileStore } from 'src/store/file-store';

@Module({
	imports: [RedisModule],
	providers: [ChatGateway, ChatsService, MessageService, Store, FileStore],
})
export class WsModule {}

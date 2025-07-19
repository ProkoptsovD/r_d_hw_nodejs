import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { UsersModule } from '../users/users.module';
import { ChatsService } from './chats.service';

@Module({
	imports: [UsersModule],
	controllers: [ChatsController],
	providers: [ChatsService],
})
export class ChatsModule {}

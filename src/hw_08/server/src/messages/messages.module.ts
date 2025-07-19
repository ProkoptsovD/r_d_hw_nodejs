import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { FileStore } from '../store/file-store';
import { MessageService } from './message.service';
import { Store } from 'src/store/store';

@Module({
	controllers: [MessagesController],
	providers: [Store, FileStore, MessageService],
})
export class MessagesModule {}

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Store } from '../store/store';
import { FileStore } from 'src/store/file-store';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [Store, FileStore, UsersService],
	exports: [Store, FileStore],
})
export class UsersModule {}

import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserDTO } from '../dto';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@Post()
	@UseInterceptors(FileInterceptor('icon'))
	async createUser(@Body('name') name: string, @UploadedFile() icon?: Express.Multer.File): Promise<UserDTO | null> {
		return await this.userService.createUser({ name, icon });
	}

	@Get()
	async list(): Promise<{ items: UserDTO[]; total: number }> {
		const users = await this.userService.getAllUsers();

		return {
			items: users,
			total: users.length,
		};
	}

	@Get('icons/:iconPath')
	async icon(@Param('iconPath') iconPath: string, @Res() res: Response) {
		const avatar = await this.userService.getUserAvatar(iconPath);
		return res.sendFile(avatar);
	}
}

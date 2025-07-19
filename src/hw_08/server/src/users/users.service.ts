import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dto';
import { FileStore } from 'src/store/file-store';
import { Store } from 'src/store/store';

@Injectable()
export class UsersService {
	constructor(private readonly store: Store, private readonly fileStore: FileStore) {}

	async getAllUsers(): Promise<UserDTO[]> {
		return (await this.store.getAllUsers()) ?? [];
	}

	async getUserAvatar(iconPath: string): Promise<string> {
		const avatar = await this.fileStore.getAvatar(iconPath);

		return avatar;
	}

	async createUser(dto: Pick<UserDTO, 'name'> & { icon?: Express.Multer.File }) {
		const url = dto.icon ? await this.fileStore.saveAvatar(dto.icon) : null;

		const user: Pick<UserDTO, 'name' | 'iconUrl'> = {
			name: dto.name,
			iconUrl: url,
		};

		return await this.store.createUser(user);
	}
}

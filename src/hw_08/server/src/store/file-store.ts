import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

@Injectable()
export class FileStore {
	constructor() {
		this._init();
	}

	private async _init() {
		const dir = path.resolve(__dirname, '../../public/icons');
		try {
			await fsp.mkdir(dir, { recursive: true });
		} catch (error) {
			console.error('Error creating directory:', error);
			throw new InternalServerErrorException('Could not initialize file store');
		}
	}
	// AVATAR
	async saveAvatar(file: Express.Multer.File) {
		const buffer = file.buffer;
		const originalName = file.originalname;

		const filePath = path.resolve(__dirname, '../../public/icons', originalName);
		await fsp.writeFile(filePath, buffer);

		return filePath;
	}

	async getAvatar(iconPath: string) {
		const filePath = path.resolve(__dirname, '../../public/icons', iconPath);
		try {
			await fsp.stat(filePath);
			return filePath;
		} catch {
			const fallback = path.resolve(__dirname, '../../public', 'avatar-fallback.png');
			return fallback;
		}
	}
}

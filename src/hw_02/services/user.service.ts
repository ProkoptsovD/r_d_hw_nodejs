import fs from 'node:fs/promises';
import { config } from '../config/index.ts';

const openDb = async <T>() => {
	const file = await fs.readFile(config.db, { encoding: 'utf-8' });
	const json = JSON.parse(file);

	return json as T;
};

const writeDb = async (content: string) => {
	await fs.writeFile(config.db, content, 'utf-8');
};

export const getUsers = async () => {
	const json = await openDb<{ name: string; id: string }[]>();

	return json ?? [];
};

export const getUserById = async (id: string) => {
	const users = await getUsers();
	return users.find((user) => user.id === id);
};

export const createUser = async (dto: { name: string }) => {
	const newUser = {
		id: crypto.randomUUID(),
		...dto,
	};
	const users = (await getUsers()) ?? [];
	await writeDb(JSON.stringify([...users, newUser]));
	return newUser;
};
export const updateUser = async (dto: Partial<{ name: string; id: string }>) => {
	const user = await getUserById(dto.id!);

	if (!user) {
		return null;
	}

	const users = (await getUsers()) ?? [];
	const newUser = { ...user, ...dto, id: user.id };
	await writeDb(JSON.stringify([...users, newUser]));

	return newUser;
};

export const deleteUser = async (id: string) => {
	const users = await getUsers();

	await writeDb(JSON.stringify([...(users ?? [])].filter((user) => user.id !== id)));
};

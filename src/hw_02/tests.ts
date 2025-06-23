import fs from 'node:fs/promises';
import { describe, test, after } from 'node:test';
import assert from 'node:assert';
import { config } from './config/index.ts';
import { runServer } from './index.ts';
import { isObject } from '../lib/type-guards.ts';

const server = runServer();

after(async () => {
	await new Promise<void>((resolve) => {
		server.close(() => {
			console.log('Gracefully shutdown after tests');
			resolve();
		});
	});
	await fs.writeFile(
		config.db,
		JSON.stringify(
			[
				{ name: 'Jonny', id: '1' },
				{ name: 'Silvia', id: '2' },
				{ name: 'Richard', id: '3' },
			],
			null,
			4,
		),
		'utf-8',
	);
	process.exit(0);
});

describe('Users CRUD', () => {
	test('GET /users', async () => {
		const res = await fetch(`http://${config.host}:${config.port}/users`);
		assert.strictEqual(res.status, 200, 'Response status should be 200');
		const { data } = await res.json();

		assert.ok(Array.isArray(data));
	});
	test('GET /users/1', async () => {
		const res = await fetch(`http://${config.host}:${config.port}/users/1`);
		assert.strictEqual(res.status, 200, 'Response status should be 200');

		const { data } = await res.json();
		assert.ok(isObject(data), 'Data should be an object');
	});
	test('POST /users', async () => {
		const res = await fetch(`http://${config.host}:${config.port}/users`, {
			method: 'POST',
			body: JSON.stringify({ name: 'Messi' }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		assert.strictEqual(res.status, 201, 'Response status should be 201');

		const { data } = await res.json();
		assert.ok(isObject(data), 'Data should be an object');
	});
	test('PUT /users/2', async () => {
		const res = await fetch(`http://${config.host}:${config.port}/users/2`, {
			method: 'PUT',
			body: JSON.stringify({ name: 'User 2 modified' }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		assert.strictEqual(res.status, 200, 'Response status should be 200');

		const { data } = await res.json();
		assert.ok(isObject(data), 'Data should be an object');
	});
	test('DELETE /users/3', async () => {
		const res = await fetch(`http://${config.host}:${config.port}/users/3`, {
			method: 'DELETE',
		});
		assert.strictEqual(res.status, 202, 'Response status should be 202');

		const { data } = await res.json();
		assert.ok(data === null, 'Data should be an null');
	});
	test('THROWS Error on not existing method', async () => {
		const res = await fetch(`http://${config.host}:${config.port}/users/3`, {
			method: 'PATCH',
		});
		assert.strictEqual(res.status, 405, 'Method not allowed');
	});
});

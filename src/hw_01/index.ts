import process from 'node:process';
import habitsRouter from './router/habits.ts';
import helpRouter from './router/help.ts';
import { commands, isHelpFlag } from './resource/cmd.ts';
import { printl } from '../lib/print.ts';

import type { CMD } from './resource/cmd.ts';

const router = {
	habits: (cmd: CMD, options: string[]) => {
		const handler = habitsRouter[cmd];
		if (!handler) return;
		handler(options);
	},
	help: (cmd: string) => {
		const handler = helpRouter[cmd];
		if (!handler) return;
		handler();
	},
};

function server() {
	printl('Вітаємо у 🔧 Vault-Tec');

	const flags = process.argv.slice(2);
	const [cmd, ...restCmdFlags] = flags;

	const isValidCmd = commands.includes(cmd);

	if (isHelpFlag(cmd)) {
		const handle = router['help'];
		return handle('help');
	}

	if (!isValidCmd) {
		const handle = router['help'];
		return handle('unknown');
	}

	const handle = router['habits'];
	handle(cmd as CMD, restCmdFlags);
}

server();

export const CMD_DEFINITION = {
	add: {
		decription: 'Додає запис про звичку',
		options: {
			name: {
				type: 'string',
				description: 'Назва звички або невеличкий опис',
				required: true,
			},
			freq: {
				type: ['daily', 'monthly', 'weekly'] as string[],
				description: 'Періодичніть звички',
				required: true,
			},
		},
	},
	list: {
		decription: 'Показує всі звички у вигляді таблиці. За замовченям показує список без урахування "soft deleted" звичок',
		options: {
			all: {
				type: 'boolean',
				description: 'До результату додає звички, які були позначені як "soft deleted"',
				required: false,
			},
		},
	},
	done: {
		decription: 'Відмічає, що звичку виконано сьогодні',
		options: {
			id: {
				type: 'string',
				description: 'ID звички, які треба позначити, як виконану',
				required: true,
			},
		},
	},
	stats: {
		decription: 'Друкує для кожної звички відсоток виконання за останні 7(30) днів',
		options: {
			gte: {
				type: 'string',
				description:
					'Фільтрує за прогресом (%) виконання звички. Мінімальний - 0, максимальний - 100. Можна комбінувати з флагом --lte . Наприклад, --gte 30 --lte 50',
				required: false,
			},
			lte: {
				type: 'string',
				description:
					'Фільтрує за прогресом (%) виконання звички. Мінімальний - 0, максимальний - 100. Можна комбінувати з флагом --gte . Наприклад, --gte 10 --lte 90',
				required: false,
			},
			eq: {
				type: 'string',
				description: 'Фільтрує за прогресом (%) виконання звички. Наприклад, --eq 50',
				required: false,
			},
			range: {
				type: ['week', 'month'] as string[],
				description: 'Задає період для фільтрації. За замовчуванням стоїть період в 7 днів',
				required: false,
			},
		},
	},
	delete: {
		decription: 'Видаляє звичку. Є два режима видалення: --soft та --hard. За замовчуванням використовується soft-видалення',
		options: {
			id: {
				type: 'string',
				description: 'ID звички, які треба видалити',
				required: true,
			},
			soft: {
				type: 'boolean',
				description: 'Позначає звичку, як видалену, але залишає запис про неї',
				required: false,
			},
			hard: {
				type: 'boolean',
				description: 'Видаляє запис безповоротньо',
				required: false,
			},
		},
	},
	update: {
		decription: 'Модифікує запис про звичку. Змніи можуть бути частковими. Наприклад, назв та/або регулярність',
		options: {
			id: {
				type: 'string',
				description: 'ID звички, які треба змінити',
				required: true,
			},
			name: {
				type: 'string',
				description: 'Назва звички або невеличкий опис',
				required: false,
			},
			freq: {
				type: ['daily', 'monthly', 'weekly'] as string[],
				description: 'Періодичніть звички',
				required: false,
			},
		},
	},
} as const;

export type CMD = keyof typeof CMD_DEFINITION;
export const commands = Object.keys(CMD_DEFINITION);
export function printHelpText(width = 80) {
	const indent = 2;

	const pad = (n: number) => ' '.repeat(n);

	const formatSection = (entries: Record<string, string>, leftPad: number = indent, colWidth: number = 20) => {
		const result: string[] = [];

		for (const [key, desc] of Object.entries(entries)) {
			const left = pad(leftPad) + key.padEnd(colWidth);
			const rightWidth = width - left.length;
			const words = desc.split(' ');
			let line = '';
			let i = 0;

			while (i < words.length) {
				if ((line + words[i]).length > rightWidth) {
					result.push(left + line.trim());
					line = '';
					break;
				}
				line += words[i++] + ' ';
			}

			if (line.trim()) result.push(left + line.trim());

			let remLine = '';
			while (i < words.length) {
				if ((remLine + words[i]).length > width - (leftPad + colWidth)) {
					result.push(pad(leftPad + colWidth) + remLine.trim());
					remLine = '';
				}
				remLine += words[i++] + ' ';
			}
			if (remLine.trim()) {
				result.push(pad(leftPad + colWidth) + remLine.trim());
			}
		}

		return result.join('\n');
	};

	console.log('\nЗагальна команда:\n  pnpm run start <command> [options]');
	console.log('\nДоступні команди:');

	const commandDescriptions: Record<string, string> = {};
	for (const [cmd, meta] of Object.entries(CMD_DEFINITION)) {
		commandDescriptions[cmd] = meta.decription || '';
	}
	console.log(formatSection(commandDescriptions));

	for (const [cmd, meta] of Object.entries(CMD_DEFINITION)) {
		console.log(`\n🔹 ${cmd}`);
		if (Object.keys(meta.options).length > 0) {
			const opts: Record<string, string> = {};
			for (const [opt, optMeta] of Object.entries(meta.options)) {
				const typeStr = Array.isArray(optMeta.type)
					? `<${optMeta.type.join(' | ')}> `
					: optMeta.type === 'boolean'
					? ''
					: `<${optMeta.type}>`;
				opts[`--${opt}` + (typeStr ? ` ${typeStr}` : '')] = optMeta.description;
			}
			console.log(formatSection(opts, indent + 2));
		} else {
			console.log(pad(indent + 2) + '(без параметрів)');
		}
	}
}

export const isHelpFlag = (cmd: string) => cmd === '--help';

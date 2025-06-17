import { isArray } from '../../lib/type-guards.ts';
import type { HabitFrequency } from '../entities/Habit.ts';

const SuccessValidationResultType = Symbol('SuccessValidationResult');
const ErrorValidationResultType = Symbol('ErrorValidationResult');
type SuccessValidation<T> = {
	success: true;
	data: T;
	__type: typeof SuccessValidationResultType;
};

export type ErrorValidation = {
	success: false;
	errors: Record<string, string[]>;
	__type: typeof ErrorValidationResultType;
};

type ValidationResult<T> = SuccessValidation<T> | ErrorValidation;

type Options = {
	[x: string]: {
		type: 'string' | 'boolean' | string[];
		description: string;
		required: boolean;
	};
};
const FREQUENCY: HabitFrequency[] = ['daily', 'monthly', 'weekly'];

const isValidFrequency = (freq: string) => FREQUENCY.includes(freq as HabitFrequency);

export const validateCmdFlags = ({ input, options }: { input: string[]; options: Options }) => {
	const isEveryRequired = Object.values(options).every((option) => option.required);

	if (isEveryRequired) {
		const cmds = Object.keys(options);
		return cmds.every((cmd) => input.includes('--' + cmd));
	}

	const requiredKeys = Object.entries(options)
		.filter(([, option]) => option.required)
		.map(([cmd]) => cmd);
	const keysInInput = requiredKeys.filter((key) => input.includes('--' + key));

	return keysInInput.length === requiredKeys.length;
};

export const validateCmdParams = <T extends object>({ input, options }: { input: string[]; options: Options }): ValidationResult<T> => {
	const errors: Record<string, string[]> = {};
	const data: T = {} as T;

	if (!validateCmdFlags({ input, options })) {
		return {
			errors: {
				root: ['Required flags are missing'],
			},
			success: false,
			__type: ErrorValidationResultType,
		};
	}

	input.forEach((flag, index) => {
		if (flag.startsWith('--')) {
			const flagname = flag.slice(2);
			const flagMeta = options[flagname];

			if (flagMeta.type === 'boolean') {
				data[flagname as keyof T] = true as (typeof data)[keyof T];
				return;
			}

			const flagValue = input[index + 1];

			if (flagMeta.type === 'string') {
				if (flagMeta.required && !flagValue) {
					if (!errors[flagname]) {
						errors[flagname] = [];
					}

					errors[flagname].push(`${flag} must be followed by a value`);
					return;
				}

				data[flagname as keyof T] = flagValue as (typeof data)[keyof T];
				return;
			}
			if (isArray(flagMeta.type)) {
				if (flagMeta.required && !isValidFrequency(flagValue)) {
					if (!errors[flagname]) {
						errors[flagname] = [];
					}

					errors[flagname].push(`${flag} must be followed by a one of these values: ${FREQUENCY.join(' | ')}`);
					return;
				}

				data[flagname as keyof T] = flagValue as (typeof data)[keyof T];
				return;
			}
		}
	});

	if (Object.keys(errors).length !== 0) {
		return {
			errors,
			success: false,
			__type: ErrorValidationResultType,
		};
	}

	return {
		data,
		success: true,
		__type: SuccessValidationResultType,
	};
};

import { printe } from '../../lib/print.ts';
import { printHelpText } from '../resource/cmd.ts';

export const help = () => printHelpText();
export const unknown = () => {
	printe('Невідома команда!');
	return printHelpText();
};

export const helpController = {
	help,
	unknown,
};

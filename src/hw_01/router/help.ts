import { helpController } from '../controllers/help.controller.ts';

const router: Record<string, VoidFunction> = {
	help: helpController.help,
	unknown: helpController.unknown,
};

export default router;

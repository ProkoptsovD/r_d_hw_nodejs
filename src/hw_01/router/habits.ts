import { habitsControllerService } from '../controllers/habits.controller.ts';
import type { CMD } from '../resource/cmd.ts';
type Handler = (params: string[]) => void;

const router: Record<CMD, Handler> = {
	add: habitsControllerService.add,
	done: habitsControllerService.done,
	list: habitsControllerService.list,
	stats: habitsControllerService.stats,
	update: habitsControllerService.update,
	delete: habitsControllerService.delete,
};

export default router;

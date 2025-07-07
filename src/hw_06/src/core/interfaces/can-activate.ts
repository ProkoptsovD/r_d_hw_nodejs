import type { ExecutionContext } from '../utils/execution-context';

export interface CanActivate {
	canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | undefined;
}

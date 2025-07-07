import { ZodError, ZodSchema } from 'zod';

import type { ArgumentMetadata } from '../../core/types/common';
import type { PipeTransform } from '../../core/types/pipes';

import { BadRequestException } from '../../core/http';
import { Injectable } from '../../core/decorators';

@Injectable()
export class ZodValidationPipe implements PipeTransform<Anything, Anything> {
	constructor(private readonly schema: ZodSchema) {}

	transform(value: unknown, meta: ArgumentMetadata) {
		try {
			return this.schema.parse(value);
		} catch (err) {
			if (err instanceof ZodError) {
				throw new BadRequestException(JSON.stringify(err.flatten().fieldErrors));
			}
			throw new BadRequestException(`Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}`);
		}
	}
}

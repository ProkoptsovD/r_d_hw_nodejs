import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const ZBody = <V, T extends ZodSchema<V>>(schema: T) => {
  return createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const rawBody: unknown = request.body;

    try {
      const result = await schema.parseAsync(rawBody);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.flatten().fieldErrors,
        });
      }

      throw new InternalServerErrorException();
    }
  })();
};

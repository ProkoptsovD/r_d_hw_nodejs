import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';
import { Public } from '../decorators/public.decorator';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = Boolean(this.reflector.get(Public, context.getHandler()));
    const apiHeader = this.configService.get<string>('SECRET_API_HEADER') ?? '';
    const secret = this.configService.get<string>('SECRET');
    const apiKey = request.get(apiHeader);
    const hasPermission = apiKey === secret;

    return isPublic || hasPermission;
  }
}

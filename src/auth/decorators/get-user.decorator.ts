import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAuthInterface } from '../interfaces/user-auth.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserAuthInterface => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

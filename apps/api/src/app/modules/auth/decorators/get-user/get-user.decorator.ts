import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser: () => ParameterDecorator = createParamDecorator((data, ctx: ExecutionContext): User => {
  const { user }: { user: User } = ctx.switchToHttp().getRequest();
  return user;
});

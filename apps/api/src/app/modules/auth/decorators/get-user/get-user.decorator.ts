import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../../../user/models/user/user.model';

export const GetUser: () => ParameterDecorator = createParamDecorator((data, ctx: ExecutionContext): UserModel => {
  const { user }: { user: UserModel } = ctx.switchToHttp().getRequest();
  return user;
});

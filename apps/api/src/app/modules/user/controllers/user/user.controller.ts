import { Body, Controller, Post } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from '../../services/user/user.service';

@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() user: Prisma.UserCreateInput): Promise<User> {
    return this.userService.create(user);
  }
}

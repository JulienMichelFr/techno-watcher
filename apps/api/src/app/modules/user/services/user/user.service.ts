import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public create(user: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data: user });
  }

  public findOne(search: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUnique({ where: search });
  }
}

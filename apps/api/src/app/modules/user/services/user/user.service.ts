import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public create(user: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data: user });
  }

  public findOne(search: Prisma.UserWhereUniqueInput, args: Prisma.UserArgs = {}): Promise<User> {
    return this.prismaService.user.findUnique({ where: search, ...args });
  }

  public async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}

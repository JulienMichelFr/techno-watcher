import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { SignUpDTO } from '@techno-watcher/api-models';

import { PrismaService } from '../../../prisma/prisma.service';
import { UserModel } from '../../models/user/user.model';

import { UserRepositoryService } from './user-repository.service';

export type UserAndSelect = Pick<UserModel, 'id' | 'email' | 'username' | 'password' | 'refreshToken'>;

@Injectable()
export class PrismaUserRepositoryService extends UserRepositoryService {
  private readonly userSelect: Prisma.UserSelect = {
    password: true,
    username: true,
    id: true,
    refreshToken: true,
  };

  public constructor(private prisma: PrismaService) {
    super();
  }

  public createUserModel(user: UserAndSelect): UserModel {
    const result: UserModel = new UserModel();
    result.id = user.id;
    result.email = user.email;
    result.username = user.username;
    result.password = user.password;
    result.refreshToken = user.refreshToken;
    return result;
  }

  public override async create(user: SignUpDTO, invitationId: number): Promise<UserModel> {
    const created: UserAndSelect = (await this.prisma.user.create({
      data: {
        ...user,
        invitation: {
          connect: {
            id: invitationId,
          },
        },
      },
      select: this.userSelect,
    })) as UserAndSelect;

    return this.createUserModel(created);
  }

  public override async findById(id: number): Promise<UserModel> {
    const user: UserAndSelect = await this.findUnique({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.createUserModel(user);
  }

  public override async findByEmail(email: string): Promise<UserModel> {
    const user: UserAndSelect = await this.findUnique({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.createUserModel(user);
  }

  public override async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const found: User = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!found) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  private async findUnique(where: Prisma.UserWhereUniqueInput): Promise<UserAndSelect | null> {
    return (await this.prisma.user.findUnique({
      where,
      select: this.userSelect,
    })) as UserAndSelect;
  }
}

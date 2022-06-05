import { Injectable } from '@nestjs/common';
import { seed } from '@ngneat/falso';
import type { User } from '@prisma/client';
import { Invitation } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../src/app/modules/prisma/prisma.service';

import { Seeder } from './base-seeder';
import { InvitationSeeder } from './invitation.seeder';
import { SEED_ID } from './seed-id';

seed(SEED_ID);

@Injectable()
export class UserSeeder extends Seeder<User> {
  public constructor(protected readonly prisma: PrismaService, protected readonly invitationSeeder: InvitationSeeder) {
    super(prisma);
  }

  private static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 12);
  }

  public async seed(): Promise<User[]> {
    const invitations: Invitation[] = await this.invitationSeeder.seed();
    await this.prisma.user.createMany({
      data: [
        {
          id: 1000,
          email: 'user1@email.com',
          password: UserSeeder.hashPassword('Pas$w0rd'),
          username: 'User 1',
          invitationId: invitations[0].id,
          createdAt: new Date(2022, 0, 1),
          updatedAt: new Date(2022, 0, 1),
        },
        {
          id: 1001,
          email: 'user2@email.com',
          password: UserSeeder.hashPassword('Pas$w0rd'),
          username: 'User 2',
          invitationId: invitations[1].id,
          createdAt: new Date(2022, 0, 1),
          updatedAt: new Date(2022, 0, 1),
        },
      ],
    });

    const users: User[] = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    this.store(users);
    return users;
  }

  public async clean(): Promise<void> {
    await this.prisma.user.deleteMany({});
    this.clearData();
  }
}

import { Injectable } from '@nestjs/common';
import { randWord, seed } from '@ngneat/falso';
import type { Invitation } from '@prisma/client';

import { generateCount } from '../helpers/generate-count';

import { Seeder } from './base-seeder';
import { SEED_ID } from './seed-id';

seed(SEED_ID);

@Injectable()
export class InvitationSeeder extends Seeder<Invitation> {
  public async seed(): Promise<Invitation[]> {
    let invitationId: number = 1000;

    function createInvitation(): { id: number; code: string } {
      return {
        id: ++invitationId,
        code: randWord(),
      };
    }

    await this.prisma.invitation.deleteMany({});
    await this.prisma.invitation.createMany({
      data: generateCount(10, createInvitation),
    });
    const data: Invitation[] = await this.prisma.invitation.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    this.store(data);

    return data;
  }

  public async clean(): Promise<void> {
    await this.prisma.invitation.deleteMany({});
    this.clearData();
  }
}

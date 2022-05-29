import { Seeder } from './base-seeder';
import type { Invitation } from '@prisma/client';
import { randWord, seed } from '@ngneat/falso';
import { generateCount } from '../helpers/generate-count';
import { SEED_ID } from './seed-id';
import { Injectable } from '@nestjs/common';

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
      data: generateCount(2, createInvitation),
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

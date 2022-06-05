import { Injectable, NotFoundException } from '@nestjs/common';
import { InvitationRepositoryService } from './invitation-repository.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Invitation, Prisma, User } from '@prisma/client';
import { InvitationModel } from '../../models/invitation/invitation.model';

export type InvitationAndSelect = Invitation & { user: Pick<User, 'id'> | null };

@Injectable()
export class PrismaInvitationRepositoryService extends InvitationRepositoryService {
  private readonly invitationSelect: Prisma.InvitationSelect = {
    id: true,
    user: {
      select: {
        id: true,
      },
    },
  };

  public constructor(private readonly prisma: PrismaService) {
    super();
  }

  public createInvitationModel(invitation: InvitationAndSelect): InvitationModel {
    const result: InvitationModel = new InvitationModel();
    result.id = invitation.id;
    result.code = invitation.code;
    result.alreadyUsed = !!invitation.user;
    return result;
  }

  public override async findByCode(code: string): Promise<InvitationModel> {
    const result: InvitationAndSelect = (await this.prisma.invitation.findUnique({
      select: this.invitationSelect,
      where: {
        code,
      },
    })) as InvitationAndSelect;

    if (!result) {
      throw new NotFoundException(`Invitation with code ${code} not found`);
    }

    return this.createInvitationModel(result);
  }
}

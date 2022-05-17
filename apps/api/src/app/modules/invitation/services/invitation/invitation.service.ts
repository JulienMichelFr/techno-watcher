import { Injectable } from '@nestjs/common';
import { Invitation, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class InvitationService {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByCode(code: string): Promise<Invitation & { user: User }> {
    return this.prisma.invitation.findUnique({
      include: {
        user: true,
      },
      where: {
        code,
      },
    });
  }
}

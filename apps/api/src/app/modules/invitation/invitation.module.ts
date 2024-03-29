import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { InvitationRepositoryService } from './repositories/invitation/invitation-repository.service';
import { PrismaInvitationRepositoryService } from './repositories/invitation/prisma-invitation-repository.service';
import { InvitationService } from './services/invitation/invitation.service';

@Module({
  imports: [PrismaModule],
  providers: [InvitationService, { provide: InvitationRepositoryService, useClass: PrismaInvitationRepositoryService }],
  exports: [InvitationService],
})
export class InvitationModule {}

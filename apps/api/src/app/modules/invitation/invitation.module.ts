import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InvitationService } from './services/invitation/invitation.service';

@Module({
  imports: [PrismaModule],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}

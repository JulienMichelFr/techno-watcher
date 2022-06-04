import { Module } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { PrismaUserRepositoryService } from './repositories/user/prisma-user-repository.service';
import { UserRepositoryService } from './repositories/user/user-repository.service';
import { InvitationModule } from '../invitation/invitation.module';

@Module({
  imports: [InvitationModule],
  providers: [UserService, { provide: UserRepositoryService, useClass: PrismaUserRepositoryService }],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}

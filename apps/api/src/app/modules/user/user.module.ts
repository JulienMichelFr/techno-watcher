import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto/crypto.module';
import { InvitationModule } from '../invitation/invitation.module';

import { PrismaUserRepositoryService } from './repositories/user/prisma-user-repository.service';
import { UserRepositoryService } from './repositories/user/user-repository.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [InvitationModule, CryptoModule],
  providers: [UserService, { provide: UserRepositoryService, useClass: PrismaUserRepositoryService }],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}

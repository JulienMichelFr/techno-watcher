import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { JWT_EXPIRATION, JWT_SECRET } from '../../constantes/config.const';
import { CryptoModule } from '../crypto/crypto.module';
import { InvitationModule } from '../invitation/invitation.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './controllers/auth/auth.controller';
import { JwtAuthGuard } from './guards/auth/jwt-auth.guard';
import { AuthService } from './services/auth/auth.service';

@Global()
@Module({
  imports: [
    CryptoModule,
    UserModule,
    InvitationModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
        signOptions: { expiresIn: configService.get(JWT_EXPIRATION) },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}

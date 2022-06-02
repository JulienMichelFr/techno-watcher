import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth/auth.controller';
import { ConfigService } from '@nestjs/config';
import { JWT_EXPIRATION, JWT_SECRET } from '../../constantes/config.const';
import { JwtAuthGuard } from './guards/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { InvitationModule } from '../invitation/invitation.module';
import { CryptoService } from './services/crypto/crypto.service';

@Global()
@Module({
  imports: [
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
    CryptoService,
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

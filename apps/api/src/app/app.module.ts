import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { JwtExceptionFilter } from './filters/jwt/jwt-exception.filter';
import { PrismaClientKnownRequestExceptionFilter } from './filters/prisma/prisma-client-known-request-exception.filter';
import { CryptoModule } from './modules/crypto/crypto.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostModule, UserModule, AuthModule, PrismaModule, CryptoModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientKnownRequestExceptionFilter,
    },
  ],
})
export class AppModule {}

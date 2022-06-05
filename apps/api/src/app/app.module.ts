import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { JwtExceptionFilter } from './filters/jwt/jwt-exception.filter';
import { PrismaClientKnownRequestExceptionFilter } from './filters/prisma/prisma-client-known-request-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { CryptoModule } from './modules/crypto/crypto.module';
import { PostModule } from './modules/post/post.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

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

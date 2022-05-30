import { Module } from '@nestjs/common';

import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtExceptionFilter } from './filters/jwt-exception/jwt-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PostModule, UserModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    },
  ],
})
export class AppModule {}

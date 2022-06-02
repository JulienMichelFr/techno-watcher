import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth.type';
import { Request } from 'express';
import { UserService } from '../../../user/services/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(private reflector: Reflector, private jwtService: JwtService, private userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader: string | null = request.header('Authorization');
    if (!authorizationHeader) {
      throw new UnauthorizedException('Token is missing');
    }

    const decodedJwt: JwtPayload = this.decodeJwt(authorizationHeader.replace('Bearer ', ''));

    const user: User = await this.userService.findOne({ id: decodedJwt.id });
    if (!user) {
      throw new UnauthorizedException('Token is invalid');
    }

    context.switchToHttp().getRequest().user = user;
    return true;
  }

  private decodeJwt(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }
}

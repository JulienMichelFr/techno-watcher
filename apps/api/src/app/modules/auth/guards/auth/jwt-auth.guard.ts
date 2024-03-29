import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserModel } from '../../../user/models/user/user.model';
import { UserService } from '../../../user/services/user/user.service';
import { JwtPayload } from '../../auth.type';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator';

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

    const user: UserModel = await this.userService.findById(decodedJwt.id);
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

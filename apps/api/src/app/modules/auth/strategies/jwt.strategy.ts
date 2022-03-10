import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user/user.service';
import { User } from '@prisma/client';
import { JwtPayload } from '../../../types/auth.type';
import { ConfigService } from '@nestjs/config';
import { JWT_EXPIRATION, JWT_SECRET } from '../../../constantes/config.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_SECRET),
      jsonWebTokenOptions: {
        expiresIn: configService.get(JWT_EXPIRATION),
      },
    });
  }

  public async validate(payload: JwtPayload): Promise<User> {
    const user: User = await this.userService.findOne({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

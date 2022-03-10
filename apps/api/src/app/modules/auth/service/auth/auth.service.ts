import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../user/services/user/user.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginDTO } from '../../../../types/auth.type';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async validateUserPassword(loginDTO: LoginDTO): Promise<JwtPayload> {
    const user: User = await this.userService.findOne({ email: loginDTO.email });
    if (user && (await AuthService.validatePassword(loginDTO.password, user.password))) {
      return { email: user.email, username: user.username, id: user.id };
    }
    return null;
  }

  public async signIn(signInDTO: LoginDTO): Promise<{ accessToken: string }> {
    const payload: JwtPayload = await this.validateUserPassword(signInDTO);
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }

  public async signUp(signUpDTO: Prisma.UserCreateInput): Promise<{ accessToken: string }> {
    const password: string = await AuthService.hashPassword(signUpDTO.password);
    await this.userService.create({ ...signUpDTO, password });

    return this.signIn({ email: signUpDTO.email, password: signUpDTO.password });
  }
}

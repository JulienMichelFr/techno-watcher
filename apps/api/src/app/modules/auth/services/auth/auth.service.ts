import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../user/services/user/user.service';
import * as bcrypt from 'bcrypt';
import { Invitation, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth.type';
import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly invitationService: InvitationService
  ) {}

  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async validateUserPassword(loginDTO: SignInDTO): Promise<JwtPayload> {
    const user: User = await this.userService.findOne({ email: loginDTO.email }, { select: { password: true, username: true, id: true } });
    if (user && (await AuthService.validatePassword(loginDTO.password, user.password))) {
      return { email: user.email, username: user.username, id: user.id };
    }
    return null;
  }

  public async signIn(signInDTO: SignInDTO): Promise<AuthResponseModel> {
    const payload: JwtPayload = await this.validateUserPassword(signInDTO);
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens({ id: payload.id, username: payload.username, email: payload.email });
  }

  public async signUp(signUpDTO: SignUpDTO): Promise<AuthResponseModel> {
    const invitation: (Invitation & { user: User }) | null = await this.invitationService.findByCode(signUpDTO.invitation);
    if (!invitation || invitation.user) {
      throw new UnauthorizedException('Invalid invitation');
    }

    const password: string = await AuthService.hashPassword(signUpDTO.password);
    await this.userService.create({ ...signUpDTO, password, invitation: { connect: { id: invitation.id } } });

    return this.signIn({ email: signUpDTO.email, password: signUpDTO.password });
  }

  public async refreshToken(refreshTokenDTO: RefreshTokenDto): Promise<AuthResponseModel> {
    const { id, email, username }: JwtPayload = await this.jwtService.verify(refreshTokenDTO.refreshToken);
    const user: User = await this.userService.findOne({ id }, { select: { email: true, username: true, id: true, refreshToken: true } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.refreshToken !== refreshTokenDTO.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens({ id, email, username });
  }

  private async generateTokens(user: JwtPayload): Promise<AuthResponseModel> {
    const accessToken: string = this.jwtService.sign(user);
    const refreshToken: string = this.jwtService.sign(user, { expiresIn: '7d' });
    await this.userService.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }
}

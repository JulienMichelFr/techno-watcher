import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../user/services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth.type';
import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { CryptoService } from '../../../crypto/services/crypto/crypto.service';
import { UserModel } from '../../../user/models/user/user.model';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly invitationService: InvitationService,
    private readonly cryptoService: CryptoService
  ) {}

  public async validateUserPassword(loginDTO: SignInDTO): Promise<JwtPayload> {
    try {
      const user: UserModel = await this.userService.findByEmail(loginDTO.email);
      const passwordValidated: boolean = await this.validatePassword(loginDTO.password, user.password);
      if (passwordValidated) {
        return { email: user.email, username: user.username, id: user.id };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  public async signIn(signInDTO: SignInDTO): Promise<AuthResponseModel> {
    const payload: JwtPayload = await this.validateUserPassword(signInDTO);
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens({ id: payload.id, username: payload.username, email: payload.email });
  }

  public async signUp(signUpDTO: SignUpDTO): Promise<AuthResponseModel> {
    const password: string = await this.hashPassword(signUpDTO.password);
    await this.userService.create({ ...signUpDTO, password });

    return this.signIn({ email: signUpDTO.email, password: signUpDTO.password });
  }

  public async refreshToken(refreshTokenDTO: RefreshTokenDto): Promise<AuthResponseModel> {
    const { id, email, username }: JwtPayload = await this.jwtService.verify(refreshTokenDTO.refreshToken);
    const user: UserModel = await this.userService.findById(id);
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

  private async hashPassword(password: string): Promise<string> {
    return this.cryptoService.hashPassword(password);
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return this.cryptoService.validatePassword(password, hashedPassword);
  }
}

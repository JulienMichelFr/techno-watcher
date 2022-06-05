import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { Public } from '../../decorators/public/public.decorator';
import { Serializer } from '../../../../decorators/serializer/serializer.decorator';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Serializer(AuthResponseModel)
  @Public()
  @HttpCode(200)
  @Post('sign-in')
  public async signIn(@Body() signInDTO: SignInDTO): Promise<AuthResponseModel> {
    try {
      return await this.authService.signIn(signInDTO);
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Serializer(AuthResponseModel)
  @Public()
  @Post('sign-up')
  public async signUp(@Body() signUpDTO: SignUpDTO): Promise<AuthResponseModel> {
    return await this.authService.signUp(signUpDTO);
  }

  @Serializer(AuthResponseModel)
  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseModel> {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}

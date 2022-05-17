import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
  public async signIn(@Body() { email, password }: SignInDTO): Promise<AuthResponseModel> {
    return await this.authService.signIn({ email, password });
  }

  @Serializer(AuthResponseModel)
  @Public()
  @Post('sign-up')
  public async signUp(@Body() { username, email, password, invitation }: SignUpDTO): Promise<AuthResponseModel> {
    return await this.authService.signUp({ username, email, password, invitation });
  }

  @Serializer(AuthResponseModel)
  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  public async refreshToken(@Body() { refreshToken }: RefreshTokenDto): Promise<AuthResponseModel> {
    return await this.authService.refreshToken({ refreshToken });
  }
}

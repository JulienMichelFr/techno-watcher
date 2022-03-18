import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { Public } from '../../decorators/public/public.decorator';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  public async signIn(@Body() { email, password }: SignInDTO): Promise<{ accessToken: string }> {
    return await this.authService.signIn({ email, password });
  }

  @Public()
  @Post('sign-up')
  public async signUp(@Body() { username, email, password }: SignUpDTO): Promise<{ accessToken: string }> {
    return await this.authService.signUp({ username, email, password });
  }
}

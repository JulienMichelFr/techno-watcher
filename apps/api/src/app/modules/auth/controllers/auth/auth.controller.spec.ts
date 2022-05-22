import { AuthService } from '../../services/auth/auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';

describe('AuthController', () => {
  let authService: AuthService;
  let controller: AuthController;

  beforeEach(() => {
    authService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      refreshToken: jest.fn(),
    } as unknown as AuthService;

    controller = new AuthController(authService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn()', () => {
    it('should call authService.signIn()', async () => {
      const dto: SignInDTO = { email: 'email', password: 'password' };
      await controller.signIn(dto);
      expect(authService.signIn).toHaveBeenCalledWith(dto);
    });
  });

  describe('signUp()', () => {
    it('should call authService.signUp()', async () => {
      const dto: SignUpDTO = { email: 'email', password: 'password', username: 'username', invitation: 'invitation' };
      await controller.signUp(dto);
      expect(authService.signUp).toHaveBeenCalledWith(dto);
    });
  });

  describe('refreshToken()', () => {
    it('should call authService.refreshToken()', async () => {
      const dto: RefreshTokenDto = { refreshToken: 'refreshToken' };
      await controller.refreshToken(dto);
      expect(authService.refreshToken).toHaveBeenCalledWith(dto);
    });
  });
});

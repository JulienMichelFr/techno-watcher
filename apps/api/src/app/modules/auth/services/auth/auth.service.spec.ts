import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';

import { UserService } from '../../../user/services/user/user.service';
import { JwtPayload } from '../../auth.type';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let service: AuthService;

  const password: string = 'password';

  beforeEach(async () => {
    userService = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      updateRefreshToken: jest.fn(),
    } as unknown as UserService;

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as JwtService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    (jwtService.sign as jest.Mock).mockReturnValue('token');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn()', () => {
    it("should throw an error if user can't be validate", async () => {
      jest.spyOn(service, 'validateUserPassword').mockResolvedValue(null);
      const dto: SignInDTO = { email: 'email', password: 'password' };
      await expect(service.signIn(dto)).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });

    it('should generate a token if user is valid', async () => {
      jest.spyOn(service, 'validateUserPassword').mockResolvedValue({ id: 1, username: 'username', email: 'email' });
      const dto: SignInDTO = { email: 'email', password: 'password' };
      const result: AuthResponseModel = await service.signIn(dto);
      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });

    it('should store new refreshToken for user', async () => {
      jest.spyOn(service, 'validateUserPassword').mockResolvedValue({ id: 1, username: 'username', email: 'email' });
      const dto: SignInDTO = { email: 'email', password: 'password' };
      await service.signIn(dto);
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(1, 'token');
    });
  });

  describe('signUp()', () => {
    let signUpDto: SignUpDTO;

    beforeEach(() => {
      signUpDto = new SignUpDTO('username', 'email', 'password', 'code');
    });

    it('should create new user', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

      await service.signUp(signUpDto);
      expect(userService.create).toHaveBeenCalledWith(
        {
          username: signUpDto.username,
          email: signUpDto.email,
          password: signUpDto.password,
        },
        signUpDto.invitation
      );
    });

    it('should use signIn() if user is created', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

      await service.signUp(signUpDto);
      expect(service.signIn).toHaveBeenCalledWith({ email: signUpDto.email, password });
    });
  });

  describe('refreshToken()', () => {
    let jwtPayload: JwtPayload;
    let refreshTokenDTO: RefreshTokenDto;

    beforeEach(() => {
      jwtPayload = { id: 1, email: 'email', username: 'username' };
      refreshTokenDTO = { refreshToken: 'token' };
    });

    it('should verify refreshToken', async () => {
      (jwtService.verify as jest.Mock).mockResolvedValue(jwtPayload);

      (userService.findById as jest.Mock).mockResolvedValue({ refreshToken: refreshTokenDTO.refreshToken });
      await service.refreshToken(refreshTokenDTO);
      expect(jwtService.verify).toHaveBeenCalledWith(refreshTokenDTO.refreshToken);
    });

    it('should throw an error if user is not found', async () => {
      (jwtService.verify as jest.Mock).mockResolvedValue(jwtPayload);

      (userService.findById as jest.Mock).mockResolvedValue(null);
      await expect(service.refreshToken(refreshTokenDTO)).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw an error if refresh token mismatch', async () => {
      (jwtService.verify as jest.Mock).mockResolvedValue(jwtPayload);

      (userService.findById as jest.Mock).mockResolvedValue({ refreshToken: 'other' });
      await expect(service.refreshToken(refreshTokenDTO)).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });

    it('should return refresh token', async () => {
      (jwtService.verify as jest.Mock).mockResolvedValue(jwtPayload);

      (userService.findById as jest.Mock).mockResolvedValue({ refreshToken: refreshTokenDTO.refreshToken });
      const result: AuthResponseModel = await service.refreshToken(refreshTokenDTO);
      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });

    it('should update refresh token', async () => {
      (jwtService.verify as jest.Mock).mockResolvedValue(jwtPayload);

      (userService.findById as jest.Mock).mockResolvedValue({ id: 1, refreshToken: refreshTokenDTO.refreshToken });
      await service.refreshToken(refreshTokenDTO);
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(1, 'token');
    });
  });
});

import { UserService } from '../../../user/services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { AuthService } from './auth.service';
import { JwtPayload } from '../../auth.type';
import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { UnauthorizedException } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import MockedFn = jest.MockedFn;

describe('AuthService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let invitationService: InvitationService;
  let cryptoService: CryptoService;
  let service: AuthService;

  const password: string = 'password';
  const hashedPassword: string = 'hashedPassword';

  beforeEach(async () => {
    userService = {
      findOne: jest.fn(),
      create: jest.fn(),
      updateRefreshToken: jest.fn(),
    } as unknown as UserService;
    invitationService = {
      findByCode: jest.fn(),
    } as unknown as InvitationService;
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as JwtService;
    cryptoService = {
      hashPassword: jest.fn(),
      validatePassword: jest.fn(),
    };

    service = new AuthService(userService, jwtService, invitationService, cryptoService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (jwtService.sign as MockedFn<any>).mockReturnValue('token');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cryptoService.hashPassword as MockedFn<any>).mockReturnValue(hashedPassword);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cryptoService.validatePassword as MockedFn<any>).mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserPassword()', () => {
    it('should return null if user is not found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue(null);
      const result: JwtPayload = await service.validateUserPassword({ email: 'email', password });
      expect(result).toBeNull();
    });

    it('should return null if password is not valid', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cryptoService.validatePassword as MockedFn<any>).mockReturnValueOnce(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue({ password: 'missMatchPassword' });
      const result: JwtPayload = await service.validateUserPassword({ email: 'email', password });
      expect(result).toBeNull();
    });

    it('should return payload if user exists and password is valid', async () => {
      const response: JwtPayload = { email: 'email', username: 'username', id: 1 };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue({ ...response, password: hashedPassword });
      const result: JwtPayload = await service.validateUserPassword({ email: 'email', password });
      expect(result).toEqual(response);
    });
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
    it('should throw an error if invitation is not valid', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (invitationService.findByCode as MockedFn<any>).mockResolvedValue(null);
      const dto: SignUpDTO = { email: 'email', password: 'password', invitation: 'code', username: 'username' };
      await expect(service.signUp(dto)).rejects.toThrowError(new UnauthorizedException('Invalid invitation'));
    });

    it('should throw an error if invitation is already used', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (invitationService.findByCode as MockedFn<any>).mockResolvedValue({ user: true });
      const dto: SignUpDTO = { email: 'email', password: 'password', invitation: 'code', username: 'username' };
      await expect(service.signUp(dto)).rejects.toThrowError(new UnauthorizedException('Invalid invitation'));
    });

    it('should create new user', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (invitationService.findByCode as MockedFn<any>).mockResolvedValue({ id: 2 });
      const dto: SignUpDTO = { email: 'email', password, invitation: 'code', username: 'username' };
      await service.signUp(dto);
      expect(userService.create).toHaveBeenCalledWith({
        email: dto.email,
        password: hashedPassword,
        username: dto.username,
        invitation: { connect: { id: 2 } },
      });
    });

    it('should use signIn() if user is created', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (invitationService.findByCode as MockedFn<any>).mockResolvedValue({ id: 2 });
      const dto: SignUpDTO = { email: 'email', password, invitation: 'code', username: 'username' };
      await service.signUp(dto);
      expect(service.signIn).toHaveBeenCalledWith({ email: dto.email, password });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jwtService.verify as MockedFn<any>).mockResolvedValue(jwtPayload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue({ refreshToken: refreshTokenDTO.refreshToken });
      await service.refreshToken(refreshTokenDTO);
      expect(jwtService.verify).toHaveBeenCalledWith(refreshTokenDTO.refreshToken);
    });

    it('should throw an error if user is not found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jwtService.verify as MockedFn<any>).mockResolvedValue(jwtPayload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue(null);
      await expect(service.refreshToken(refreshTokenDTO)).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw an error if refresh token mismatch', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jwtService.verify as MockedFn<any>).mockResolvedValue(jwtPayload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue({ refreshToken: 'other' });
      await expect(service.refreshToken(refreshTokenDTO)).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });

    it('should return refresh token', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jwtService.verify as MockedFn<any>).mockResolvedValue(jwtPayload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue({ refreshToken: refreshTokenDTO.refreshToken });
      const result: AuthResponseModel = await service.refreshToken(refreshTokenDTO);
      expect(result).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });

    it('should update refresh token', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (jwtService.verify as MockedFn<any>).mockResolvedValue(jwtPayload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue({ id: 1, refreshToken: refreshTokenDTO.refreshToken });
      await service.refreshToken(refreshTokenDTO);
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(1, 'token');
    });
  });
});

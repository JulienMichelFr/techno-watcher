import { UserService } from '../../../user/services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { AuthService } from './auth.service';
import { JwtPayload } from '../../auth.type';
import { AuthResponseModel, RefreshTokenDto, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { UnauthorizedException } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { InvitationModel } from '../../../invitation/models/invitation/invitation.model';

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
      findById: jest.fn(),
      findByEmail: jest.fn(),
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

    (jwtService.sign as jest.Mock).mockReturnValue('token');

    (cryptoService.hashPassword as jest.Mock).mockReturnValue(hashedPassword);

    (cryptoService.validatePassword as jest.Mock).mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserPassword()', () => {
    it('should return null if user is not found', async () => {
      (userService.findByEmail as jest.Mock).mockRejectedValue(null);
      const result: JwtPayload = await service.validateUserPassword({ email: 'email', password });
      expect(result).toBeNull();
    });

    it('should return null if password is not valid', async () => {
      (cryptoService.validatePassword as jest.Mock).mockReturnValueOnce(false);

      (userService.findByEmail as jest.Mock).mockResolvedValue({ password: 'missMatchPassword' });
      const result: JwtPayload = await service.validateUserPassword({ email: 'email', password });
      expect(result).toBeNull();
    });

    it('should return payload if user exists and password is valid', async () => {
      const response: JwtPayload = { email: 'email', username: 'username', id: 1 };

      (userService.findByEmail as jest.Mock).mockResolvedValue({ ...response, password: hashedPassword });
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
    let invitation: InvitationModel;
    let signUpDto: SignUpDTO;

    beforeEach(() => {
      invitation = new InvitationModel();
      invitation.id = 2;
      invitation.code = 'code';
      invitation.alreadyUsed = false;

      (invitationService.findByCode as jest.Mock).mockResolvedValue(invitation);

      signUpDto = new SignUpDTO('username', 'email', 'password', invitation.code);
    });

    it('should create new user', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

      await service.signUp(signUpDto);
      expect(userService.create).toHaveBeenCalledWith({ ...signUpDto, password: hashedPassword });
    });

    it('should use signIn() if user is created', async () => {
      jest.spyOn(service, 'signIn').mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

      (invitationService.findByCode as jest.Mock).mockResolvedValue({ id: 2 });
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

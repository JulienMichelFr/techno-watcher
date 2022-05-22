import { UserService } from '../../user/services/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../auth.type';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import MockedFn = jest.MockedFn;

describe('JwtStrategy', () => {
  let userService: UserService;
  let configService: ConfigService;
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    userService = { findOne: jest.fn() } as unknown as UserService;
    configService = { get: jest.fn().mockReturnValue('config') } as unknown as ConfigService;
    jwtStrategy = new JwtStrategy(userService, configService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    let payload: JwtPayload;

    beforeEach(() => {
      payload = { id: 1, username: 'username', email: 'email' };
    });

    it('should throw an error if the user is not found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue(null);
      await expect(jwtStrategy.validate(payload)).rejects.toThrowError(new UnauthorizedException());
    });

    it('should return the user if the user is found', async () => {
      const response: User = { id: 1, username: 'username', email: 'email' } as User;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userService.findOne as MockedFn<any>).mockResolvedValue(response);
      const result: User = await jwtStrategy.validate(payload);
      expect(result).toEqual(response);
    });
  });
});

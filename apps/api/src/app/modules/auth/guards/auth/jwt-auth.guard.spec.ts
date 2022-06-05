import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request } from 'express';

import { UserService } from '../../../user/services/user/user.service';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflectorMock: Reflector;
  let jwtServiceMock: JwtService;
  let userServiceMock: UserService;
  let context: ExecutionContext;
  let httpArgumentsHostMock: HttpArgumentsHost;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;

    jwtServiceMock = {
      verify: jest.fn(),
    } as unknown as JwtService;

    userServiceMock = {
      findById: jest.fn(),
    } as unknown as UserService;

    httpArgumentsHostMock = {
      getRequest: jest.fn(),
    } as unknown as HttpArgumentsHost;

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp(): HttpArgumentsHost {
        return httpArgumentsHostMock;
      },
    } as unknown as ExecutionContext;

    guard = new JwtAuthGuard(reflectorMock, jwtServiceMock, userServiceMock);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate()', () => {
    it('should authorize if route is public', async () => {
      (reflectorMock.getAllAndOverride as jest.Mock).mockReturnValue(true);
      const result: boolean = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw an unauthorized exception if token is missing', async () => {
      (httpArgumentsHostMock.getRequest as jest.Mock).mockReturnValue({
        header() {
          return null;
        },
      });
      await expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException('Token is missing'));
    });

    it('should throw an unauthorized exception if user is not found', async () => {
      (httpArgumentsHostMock.getRequest as jest.Mock).mockReturnValue({
        header() {
          return 'token';
        },
      });
      (jwtServiceMock.verify as jest.Mock).mockReturnValue({ id: 1 });
      (userServiceMock.findById as jest.Mock).mockResolvedValue(null);
      await expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException('Token is invalid'));
    });

    it('should authorize if user is found', async () => {
      (httpArgumentsHostMock.getRequest as jest.Mock).mockReturnValue({
        header() {
          return 'token';
        },
      });
      (jwtServiceMock.verify as jest.Mock).mockReturnValue({ id: 1 });
      (userServiceMock.findById as jest.Mock).mockResolvedValue({ id: 1 });
      const result: boolean = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should store user in context request', async () => {
      (httpArgumentsHostMock.getRequest as jest.Mock).mockReturnValue({
        header() {
          return 'token';
        },
      });
      (jwtServiceMock.verify as jest.Mock).mockReturnValue({ id: 1 });
      (userServiceMock.findById as jest.Mock).mockResolvedValue({ id: 1 });
      await guard.canActivate(context);
      const r: Request & { user: User } = context.switchToHttp().getRequest();
      expect(r.user).toEqual({ id: 1 });
    });
  });
});

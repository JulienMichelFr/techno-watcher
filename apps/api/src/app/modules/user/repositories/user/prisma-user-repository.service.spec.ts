import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { SignUpDTO } from '@techno-watcher/api-models';

import { PrismaService } from '../../../prisma/prisma.service';
import { UserModel } from '../../models/user/user.model';

import { PrismaUserRepositoryService, UserAndSelect } from './prisma-user-repository.service';

describe('PrismaUserRepositoryService', () => {
  let service: PrismaUserRepositoryService;
  let prisma: PrismaService;
  let userSelect: Prisma.UserSelect;
  let userAndSelect: UserAndSelect;

  beforeEach(async () => {
    userSelect = {
      password: true,
      username: true,
      id: true,
      refreshToken: true,
    };

    userAndSelect = {
      id: 1,
      email: 'email',
      username: 'username',
      password: 'password',
      refreshToken: 'refreshToken',
    };

    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaUserRepositoryService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PrismaUserRepositoryService>(PrismaUserRepositoryService);
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2022, 1, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUserModel()', () => {
    it('should return correct UserModel', () => {
      const result: UserModel = service.createUserModel(userAndSelect);
      expect(result).toBeInstanceOf(UserModel);
      expect(result.id).toBe(userAndSelect.id);
      expect(result.email).toBe(userAndSelect.email);
      expect(result.username).toBe(userAndSelect.username);
      expect(result.password).toBe(userAndSelect.password);
      expect(result.refreshToken).toBe(userAndSelect.refreshToken);
    });
  });

  describe('create()', () => {
    let signUpDto: SignUpDTO;
    let invitationId: number;

    beforeEach(() => {
      signUpDto = {
        email: 'email',
        username: 'username',
        password: 'password',
        invitation: 'invitation',
      };

      invitationId = 2;

      (prisma.user.create as jest.Mock).mockResolvedValue(userAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.create(signUpDto, invitationId);
      expect(prisma.user.create).toBeCalledWith({
        data: {
          ...signUpDto,
          invitation: {
            connect: {
              id: invitationId,
            },
          },
        },
        select: userSelect,
      });
    });
  });

  describe('findById()', () => {
    let userId: number;

    beforeEach(() => {
      userId = 1;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.findById(userId);
      expect(prisma.user.findUnique).toBeCalledWith({
        where: {
          id: userId,
        },
        select: userSelect,
      });
    });

    it('should map to UserModel', async () => {
      const result: UserModel = await service.findById(userId);
      expect(result).toBeInstanceOf(UserModel);
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findById(userId)).rejects.toThrowError(new NotFoundException(`User with id ${userId} not found`));
    });
  });

  describe('findByEmail()', () => {
    let email: string;

    beforeEach(() => {
      email = 'email';
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.findByEmail(email);
      expect(prisma.user.findUnique).toBeCalledWith({
        where: {
          email,
        },
        select: userSelect,
      });
    });

    it('should map to UserModel', async () => {
      const result: UserModel = await service.findByEmail(email);
      expect(result).toBeInstanceOf(UserModel);
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findByEmail(email)).rejects.toThrowError(new NotFoundException(`User with email ${email} not found`));
    });
  });

  describe('updateRefreshToken()', () => {
    beforeEach(() => {
      (prisma.user.update as jest.Mock).mockResolvedValue(userAndSelect);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userAndSelect);
    });

    it('should update user refresh token', async () => {
      await service.updateRefreshToken(userAndSelect.id, 'newRefreshToken');
      expect(prisma.user.update).toBeCalledWith({
        where: {
          id: userAndSelect.id,
        },
        data: {
          refreshToken: 'newRefreshToken',
        },
      });
    });

    it('should verify if user exists', async () => {
      await service.updateRefreshToken(userAndSelect.id, 'newRefreshToken');
      expect(prisma.user.findUnique).toBeCalledWith({
        where: {
          id: userAndSelect.id,
        },
      });
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.updateRefreshToken(userAndSelect.id, 'newRefreshToken')).rejects.toThrowError(
        new NotFoundException(`User with id ${userAndSelect.id} not found`)
      );
    });
  });
});

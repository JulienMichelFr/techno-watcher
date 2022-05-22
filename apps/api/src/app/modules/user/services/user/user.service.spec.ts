import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

describe('UserService', () => {
  let prismaService: PrismaService;
  let userService: UserService;

  beforeEach(() => {
    prismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    userService = new UserService(prismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create()', () => {
    it('should call prisma service with correct args', async () => {
      const user: Prisma.UserCreateInput = {
        email: 'email',
      } as unknown as Prisma.UserCreateInput;
      await userService.create(user);
      expect(prismaService.user.create).toHaveBeenCalledWith({ data: user });
    });
  });

  describe('findOne()', () => {
    let conditions: Prisma.UserWhereUniqueInput;

    beforeEach(() => {
      conditions = { id: 1 };
    });

    it('should call prisma service with correct args', async () => {
      await userService.findOne(conditions);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: conditions });
    });

    it('should add extra args', async () => {
      await userService.findOne(conditions, { select: { id: true } });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: conditions, select: { id: true } });
    });
  });

  describe('updateRefreshToken()', () => {
    it('should call prisma service with correct args', async () => {
      await userService.updateRefreshToken(1, 'refreshToken');
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshToken: 'refreshToken' },
      });
    });
  });
});

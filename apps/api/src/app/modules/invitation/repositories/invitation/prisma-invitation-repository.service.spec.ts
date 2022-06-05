import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { InvitationModel } from '../../models/invitation/invitation.model';

import { InvitationAndSelect, PrismaInvitationRepositoryService } from './prisma-invitation-repository.service';

describe('PrismaInvitationRepositoryService', () => {
  let service: PrismaInvitationRepositoryService;
  let prisma: PrismaService;
  let invitationSelect: Prisma.InvitationSelect;
  let invitationAndSelect: InvitationAndSelect;

  beforeEach(async () => {
    invitationSelect = {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
    };

    invitationAndSelect = {
      id: 1,
      code: 'code',
      user: {
        id: 2,
      },
    };

    prisma = {
      invitation: {
        findUnique: jest.fn(),
      } as unknown as PrismaService,
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaInvitationRepositoryService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PrismaInvitationRepositoryService>(PrismaInvitationRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvitationModel', () => {
    it('should return InvitationModel', () => {
      const result: InvitationModel = service.createInvitationModel(invitationAndSelect);
      expect(result).toBeInstanceOf(InvitationModel);
      expect(result.code).toBe(invitationAndSelect.code);
      expect(result.alreadyUsed).toBe(true);
    });
    it('should return InvitationModel when user is falsy', () => {
      invitationAndSelect.user = null;
      const result: InvitationModel = service.createInvitationModel(invitationAndSelect);
      expect(result).toBeInstanceOf(InvitationModel);
      expect(result.code).toBe(invitationAndSelect.code);
      expect(result.alreadyUsed).toBe(false);
    });
  });

  describe('findByCode', () => {
    let code: string;
    beforeEach(() => {
      code = 'code';
      (prisma.invitation.findUnique as jest.Mock).mockReturnValue(invitationAndSelect);
    });

    it('should call prisma service with correct args', async () => {
      await service.findByCode(code);
      expect(prisma.invitation.findUnique).toBeCalledWith({
        where: {
          code,
        },
        select: invitationSelect,
      });
    });

    it('should map response to CommentModel', async () => {
      const result: InvitationModel = await service.findByCode(code);
      expect(result).toBeInstanceOf(InvitationModel);
    });

    it('should throw an error when invitation is not found', async () => {
      (prisma.invitation.findUnique as jest.Mock).mockReturnValue(null);
      await expect(service.findByCode(code)).rejects.toThrowError(new NotFoundException(`Invitation with code ${code} not found`));
    });
  });
});

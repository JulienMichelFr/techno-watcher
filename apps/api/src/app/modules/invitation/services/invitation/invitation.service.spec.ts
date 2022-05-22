import { PrismaService } from '../../../prisma/prisma.service';
import { InvitationService } from './invitation.service';

describe('InvitationService', () => {
  let prismaService: PrismaService;
  let invitationService: InvitationService;

  beforeEach(() => {
    prismaService = {
      invitation: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    invitationService = new InvitationService(prismaService);
  });

  it('should be defined', () => {
    expect(invitationService).toBeDefined();
  });

  describe('findByCode()', () => {
    it('should call prismaService', async () => {
      await invitationService.findByCode('code');
      expect(prismaService.invitation.findUnique).toHaveBeenCalledWith({
        include: {
          user: true,
        },
        where: {
          code: 'code',
        },
      });
    });
  });
});

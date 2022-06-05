import { Test, TestingModule } from '@nestjs/testing';

import { InvitationRepositoryService } from '../../repositories/invitation/invitation-repository.service';

import { InvitationService } from './invitation.service';

describe('InvitationService', () => {
  let repository: InvitationRepositoryService;
  let service: InvitationService;
  let invitationCode: string;

  beforeEach(async () => {
    invitationCode = 'code';

    repository = {
      findByCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationService, { provide: InvitationRepositoryService, useValue: repository }],
    }).compile();

    service = module.get<InvitationService>(InvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByCode()', () => {
    it('should call repository', async () => {
      await service.findByCode(invitationCode);
      expect(repository.findByCode).toHaveBeenCalledWith(invitationCode);
    });
  });
});

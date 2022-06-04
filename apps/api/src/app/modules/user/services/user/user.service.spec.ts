import { UserService } from './user.service';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InvitationModel } from '../../../invitation/models/invitation/invitation.model';
import { SignUpDTO } from '@techno-watcher/api-models';
import { UserRepositoryService } from '../../repositories/user/user-repository.service';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepositoryService;
  let invitationService: InvitationService;
  let userId: number;

  beforeEach(async () => {
    userId = 1;

    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    invitationService = {
      findByCode: jest.fn(),
    } as unknown as InvitationService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositoryService,
          useValue: repository,
        },
        {
          provide: InvitationService,
          useValue: invitationService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    let invitation: InvitationModel;
    let signUpDTO: SignUpDTO;

    beforeEach(() => {
      signUpDTO = new SignUpDTO('username', 'email', 'password', 'invitation');
      invitation = new InvitationModel();
      invitation.id = 2;
      (invitationService.findByCode as jest.Mock).mockResolvedValue(invitation);
    });

    it('should get invitation from InvitationService', async () => {
      await service.create(signUpDTO);
      expect(invitationService.findByCode).toHaveBeenCalledWith(signUpDTO.invitation);
    });

    it('should create user with repository', async () => {
      await service.create(signUpDTO);
      expect(repository.create).toHaveBeenCalledWith(signUpDTO, invitation.id);
    });
  });

  describe('findById()', () => {
    it('should find user by id', async () => {
      await service.findById(userId);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findByEmail()', () => {
    let email: string;

    beforeEach(() => {
      email = 'email';
    });

    it('should find user by email', async () => {
      await service.findByEmail(email);
      expect(repository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('updateRefreshToken()', () => {
    let refreshToken: string;

    beforeEach(() => {
      refreshToken = 'refreshToken';
    });

    it('should update refresh token', async () => {
      await service.updateRefreshToken(userId, refreshToken);
      expect(repository.updateRefreshToken).toHaveBeenCalledWith(userId, refreshToken);
    });
  });
});

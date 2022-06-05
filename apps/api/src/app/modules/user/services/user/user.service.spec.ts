import { UserService } from './user.service';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InvitationModel } from '../../../invitation/models/invitation/invitation.model';
import { UserRepositoryService } from '../../repositories/user/user-repository.service';
import { CryptoService } from '../../../crypto/services/crypto/crypto.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UserModel } from '../../models/user/user.model';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepositoryService;
  let invitationService: InvitationService;
  let cryptoService: CryptoService;
  let userId: number;

  beforeEach(async () => {
    userId = 1;

    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    cryptoService = {
      hashPassword: jest.fn(),
      validatePassword: jest.fn(),
    } as CryptoService;

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
        {
          provide: CryptoService,
          useValue: cryptoService,
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
    let createUserDto: CreateUserDto;
    let hashedPassword: string;

    beforeEach(() => {
      createUserDto = new CreateUserDto();
      createUserDto.email = 'email';
      createUserDto.password = 'password';
      createUserDto.username = 'username';

      hashedPassword = 'hashedPassword';

      invitation = new InvitationModel();
      invitation.id = 2;
      invitation.code = 'code';
      (invitationService.findByCode as jest.Mock).mockResolvedValue(invitation);
      (cryptoService.hashPassword as jest.Mock).mockReturnValue(hashedPassword);
    });

    it('should get invitation from InvitationService', async () => {
      await service.create(createUserDto, invitation.code);
      expect(invitationService.findByCode).toHaveBeenCalledWith(invitation.code);
    });

    it('should hash provided password', async () => {
      await service.create(createUserDto, invitation.code);
      expect(cryptoService.hashPassword).toHaveBeenCalledWith(createUserDto.password);
    });

    it('should create user with repository', async () => {
      await service.create(createUserDto, invitation.code);
      expect(repository.create).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword }, invitation.id);
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

  describe('validateUserPassword()', () => {
    let userModel: UserModel;
    let password: string;

    beforeEach(() => {
      password = 'password';
      userModel = new UserModel();
      userModel.password = 'hashed password';
    });

    it('should return null if password is not valid', async () => {
      (cryptoService.validatePassword as jest.Mock).mockReturnValueOnce(false);

      const result: boolean = await service.validateUserPassword(userModel, password);
      expect(result).toBeFalsy();
    });

    it('should return payload if user exists and password is valid', async () => {
      (cryptoService.validatePassword as jest.Mock).mockReturnValueOnce(true);
      const result: boolean = await service.validateUserPassword(userModel, password);
      expect(result).toBeTruthy();
    });
  });
});

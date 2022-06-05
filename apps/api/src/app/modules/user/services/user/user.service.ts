import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepositoryService } from '../../repositories/user/user-repository.service';
import { UserModel } from '../../models/user/user.model';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { InvitationModel } from '../../../invitation/models/invitation/invitation.model';
import { CryptoService } from '../../../crypto/services/crypto/crypto.service';
import { CreateUserDto } from '../../dtos/create-user.dto';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepositoryService,
    private invitationService: InvitationService,
    private cryptoService: CryptoService
  ) {}

  public async create(user: CreateUserDto, invitationCode: string): Promise<UserModel> {
    const password: string = await this.hashPassword(user.password);

    let invitation: InvitationModel;
    try {
      invitation = await this.invitationService.findByCode(invitationCode);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnprocessableEntityException('Invalid invitation');
      }
      throw e;
    }

    if (invitation.alreadyUsed) {
      throw new UnprocessableEntityException('Invalid invitation');
    }
    return this.userRepository.create(
      {
        username: user.username,
        email: user.email,
        password,
      },
      invitation.id
    );
  }

  public async findById(userId: number): Promise<UserModel> {
    return this.userRepository.findById(userId);
  }

  public async findByEmail(email: string): Promise<UserModel> {
    return this.userRepository.findByEmail(email);
  }

  public async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, refreshToken);
  }

  public async validateUserPassword(user: UserModel, password: string): Promise<boolean> {
    return this.cryptoService.validatePassword(password, user.password);
  }

  private async hashPassword(password: string): Promise<string> {
    return this.cryptoService.hashPassword(password);
  }
}

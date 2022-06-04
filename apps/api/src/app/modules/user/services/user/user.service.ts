import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepositoryService } from '../../repositories/user/user-repository.service';
import { UserModel } from '../../models/user/user.model';
import { SignUpDTO } from '@techno-watcher/api-models';
import { InvitationService } from '../../../invitation/services/invitation/invitation.service';
import { InvitationModel } from '../../../invitation/models/invitation/invitation.model';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepositoryService, private invitationService: InvitationService) {}

  public async create(user: SignUpDTO): Promise<UserModel> {
    let invitation: InvitationModel;
    try {
      invitation = await this.invitationService.findByCode(user.invitation);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnprocessableEntityException('Invalid invitation');
      }
      throw e;
    }

    if (invitation.alreadyUsed) {
      throw new UnprocessableEntityException('Invalid invitation');
    }
    return this.userRepository.create(user, invitation.id);
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
}

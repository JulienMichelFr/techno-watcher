import { SignUpDTO } from '@techno-watcher/api-models';
import { UserModel } from '../../models/user/user.model';

export abstract class UserRepositoryService {
  // TODO: add a CreateUserDto
  public abstract create(user: SignUpDTO, invitationId: number): Promise<UserModel>;

  public abstract findById(id: number): Promise<UserModel>;

  public abstract findByEmail(email: string): Promise<UserModel>;

  public abstract updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
}

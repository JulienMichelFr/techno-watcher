import { CreateUserDto } from '../../dtos/create-user.dto';
import { UserModel } from '../../models/user/user.model';

export abstract class UserRepositoryService {
  public abstract create(user: CreateUserDto, invitationId: number): Promise<UserModel>;

  public abstract findById(id: number): Promise<UserModel>;

  public abstract findByEmail(email: string): Promise<UserModel>;

  public abstract updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
}

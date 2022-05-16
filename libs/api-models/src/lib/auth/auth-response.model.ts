import { Expose } from 'class-transformer';

export class AuthResponseModel {
  @Expose()
  public accessToken!: string;
  @Expose()
  public refreshToken!: string;
}

export class UserModel {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public refreshToken?: string;
}

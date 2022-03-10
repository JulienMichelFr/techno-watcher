import { IsEmail, IsString } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  public email: string;
  @IsString()
  public password: string;
}

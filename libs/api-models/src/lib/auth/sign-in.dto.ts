import { IsEmail, IsString } from 'class-validator';
import type { User } from '@prisma/client';

export class SignInDTO implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  public email!: string;
  @IsString()
  public password!: string;
}

import type { User } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class SignInDTO implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  public email!: string;
  @IsString()
  public password!: string;
}

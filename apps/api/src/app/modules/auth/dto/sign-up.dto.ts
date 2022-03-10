import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/*
  Contains at least 1 uppercase
  Contains at least 1 lowercase
  Contains at least 1 number or special character
 */
const PASSWORD_REGEXP: RegExp = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export class SignUpDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public username: string;
  @IsEmail()
  public email: string;
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(PASSWORD_REGEXP, { message: 'Password is too weak' })
  public password: string;

  public constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

import {User} from "@prisma/client";
import {Expose} from "class-transformer";

export class AuthorModel implements Pick<User, 'username'> {
  @Expose()
  public username!: string;
}

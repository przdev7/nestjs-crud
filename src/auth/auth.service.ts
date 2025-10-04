import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly user: UsersService) {}

  async signIn(data: LoginUserDTO): Promise<object> {
    const existingUser = await this.user.findOne(data.email ?? data.username);
    if (!existingUser) throw new UnauthorizedException();
    if (!(await bcrypt.compare(data.password, existingUser.password))) throw new UnauthorizedException();

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };

    return payload;
  }

  async signUp(data: CreateUserDTO): Promise<string> {
    data.password = await bcrypt.hash(data.password, 10);
    await this.user.create(data);
    return "User created";
  }
}

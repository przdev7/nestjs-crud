import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import * as bcrypt from "bcrypt";

@Controller("auth")
export class AuthController {
  constructor(private readonly user: UsersService) {}

  @Post("sign-up")
  async signUp(@Body() data: CreateUserDTO): Promise<string> {
    data.password = await bcrypt.hash(data.password, 10);
    await this.user.create(data);
    return "User created";
  }

  @Post("sign-in")
  async signIn(@Body() data: LoginUserDTO): Promise<object> {
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
}

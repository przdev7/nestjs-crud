import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() data: CreateUserDTO): Promise<string> {
    return await this.auth.signUp(data);
  }

  @Post("sign-in")
  async signIn(@Body() data: LoginUserDTO): Promise<object> {
    return await this.auth.signIn(data);
  }
}

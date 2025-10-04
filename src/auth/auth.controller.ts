import { Body, Controller, Post, Request } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { AuthService } from "./auth.service";
import { AuthType, Public } from "./auth.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("sign-up")
  async signUp(@Body() data: CreateUserDTO): Promise<string> {
    return await this.auth.signUp(data);
  }

  @Public()
  @Post("sign-in")
  async signIn(@Body() data: LoginUserDTO): Promise<object> {
    return await this.auth.signIn(data);
  }

  @AuthType("REFRESH")
  @Post("refresh")
  async refresh(@Request() req): Promise<object> {
    const { id, username, email } = req.user;
    const payload = { id, username, email };
    return await { token: await this.auth.refresh(payload) };
  }
}

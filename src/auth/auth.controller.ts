import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { ChangePasswordUserDTO, CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { AuthService } from "./auth.service";
import { AuthType, Public } from "./auth.decorator";
import { jwtTypes } from "../shared";
import IJwtPayload from "../shared/types/jwtPayload";

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

  @Post("change-password")
  @HttpCode(200)
  async changePassword(@Body() data: ChangePasswordUserDTO, @Req() req: Request): Promise<string> {
    return await this.auth.changePassword(data.password, req.user);
  }

  @AuthType(jwtTypes.REFRESH)
  @Post("refresh")
  async refresh(@Req() req: Request): Promise<object> {
    const { id, username, email } = req.user;
    const payload: IJwtPayload = { id, username, email };
    return await { token: await this.auth.refresh(payload) };
  }
}

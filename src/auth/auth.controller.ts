import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { ChangePasswordUserDTO, CreateUserDTO, LoginUserDTO } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthType, Roles } from "../common/decorators/auth.decorator";
import { jwtTypes, IJwtPayload, roles } from "../shared";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Roles([])
  @Post("sign-up")
  async signUp(@Body() data: CreateUserDTO): Promise<string> {
    return await this.auth.signUp(data);
  }

  @Roles([])
  @Post("sign-in")
  async signIn(@Body() data: LoginUserDTO): Promise<object> {
    return await this.auth.signIn(data);
  }

  @Roles([roles.USER])
  @Post("change-password")
  @HttpCode(200)
  async changePassword(@Body() data: ChangePasswordUserDTO, @Req() req: Request): Promise<string> {
    return await this.auth.changePassword(data.password, req.user);
  }

  @Roles([roles.USER])
  @AuthType(jwtTypes.REFRESH)
  @Post("refresh")
  async refresh(@Req() req: Request): Promise<object> {
    const { id, username, email } = req.user;
    const payload: IJwtPayload = { id, username, email };
    return await { token: await this.auth.refresh(payload) };
  }

  @Roles([roles.USER])
  @Post("logout")
  async logout(@Req() req: Request): Promise<string> {
    const payload: IJwtPayload = req.user;
    return await this.auth.logout(payload);
  }
}

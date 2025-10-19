import { Body, Controller, HttpCode, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { ChangePasswordUserDTO, CreateUserDTO, LoginUserDTO } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthType, Roles } from "../common/decorators/auth.decorator";
import { IJwtPayload, jwtEnum, roles } from "../shared";

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
  @AuthType(jwtEnum.REFRESH)
  @Post("refresh")
  async refresh(@Req() req: Request): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, ...payload } = req.user as IJwtPayload;
    return await { token: await this.auth.refresh(payload) };
  }

  @Roles([roles.USER])
  @Post("logout")
  async logout(@Req() req: Request): Promise<string> {
    return await this.auth.logout(req.user);
  }
}

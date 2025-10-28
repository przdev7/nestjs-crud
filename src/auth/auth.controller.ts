import { Body, Controller, HttpCode, Post, Req, Res } from "@nestjs/common";
import { ChangePasswordUserDTO, CreateUserDTO, LoginUserDTO } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthType, Roles } from "../common/decorators/auth.decorator";
import * as shared from "../shared";
import type { Response } from "express";
import ms from "ms";

// res
//   .cookie("access_token", await this.auth.refresh(payload), {
//     signed: true,
//     httpOnly: true,
//     expires: new Date(now + req.user.exp),
//   })
//   .send("refreshed");
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
  async signIn(@Body() data: LoginUserDTO, @Res() res: Response): Promise<object> {
    const tokens: object = await this.auth.signIn(data);
    const now = Date.now();

    return res
      .cookie("refresh_token", Object.values(tokens)[1], {
        signed: true,
        httpOnly: true,
        expires: new Date(now + ms("30d")),
      })
      .json({ token: Object.values(tokens)[0] });
  }

  @Roles([shared.roles.USER])
  @Post("change-password")
  @HttpCode(200)
  async changePassword(@Body() data: ChangePasswordUserDTO, @Req() req: shared.IAuthRequest): Promise<string> {
    return await this.auth.changePassword(data.password, req.user);
  }

  @Roles([shared.roles.USER])
  @AuthType(shared.jwtEnum.REFRESH)
  @Post("refresh")
  async refresh(@Req() req: shared.IAuthRequest): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, username, email, ...payload } = req.user;
    return { token: await this.auth.refresh(payload) };
  }

  @Roles([shared.roles.USER])
  @Post("logout")
  async logout(@Req() req: shared.IAuthRequest): Promise<string> {
    return await this.auth.logout(req.user);
  }
}

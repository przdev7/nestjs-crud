import { Controller, Request, Get } from "@nestjs/common";
import { Roles } from "../common/decorators/auth.decorator";

@Controller("users")
export class UsersController {
  @Get("me")
  @Roles([])
  async me(@Request() req) {
    return req.user;
  }
}

import { Controller, UseGuards, Request, Get } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";

@Controller("users")
export class UsersController {
  @Get("me")
  // @UseGuards(AuthGuard)
  async me(@Request() req) {
    return req.user;
  }
}

import { Controller, Request, Get } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("me")
  async me(@Request() req) {
    return req.user;
  }
}

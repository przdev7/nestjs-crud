import { Controller, Request, Get } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("me")
  // @UseGuards(AuthGuard)
  async me(@Request() req) {
    return req.user;
  }
}

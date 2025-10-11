import { Controller, Request, Get } from "@nestjs/common";
import { Roles } from "../common/decorators/auth.decorator";
import { roles } from "../shared";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @Get("me")
  @Roles([])
  async me(@Request() req) {
    return req.user;
  }

  @Get("all")
  @Roles([roles.ADMIN])
  async findAll() {
    return await this.user.findAll();
  }
}

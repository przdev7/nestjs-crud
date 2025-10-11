import { Controller, Req, Get } from "@nestjs/common";
import { Roles } from "../common/decorators/auth.decorator";
import { roles } from "../shared";
import { UsersService } from "./users.service";
import type { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @Get("me")
  @Roles([roles.USER])
  async me(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Get("all")
  @Roles([roles.ADMIN])
  async findAll() {
    return await this.user.findAll();
  }
}

import { Controller, Req, Get } from "@nestjs/common";
import { Roles } from "../common/decorators/auth.decorator";
import * as shared from "../shared";
import { UsersService } from "./users.service";
import { plainToInstance } from "class-transformer";
import { UserDTO } from "./dto/user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly user: UsersService) {}

  @Get("me")
  @Roles([shared.roles.USER])
  async me(@Req() req: shared.IAuthRequest) {
    return await plainToInstance(UserDTO, this.user.findById(parseInt(req.user.sub)), {
      excludeExtraneousValues: true,
    });
  }

  @Get("all")
  @Roles([shared.roles.ADMIN])
  async findAll() {
    return await this.user.findAll();
  }
}

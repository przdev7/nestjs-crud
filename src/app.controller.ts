import { Controller, Get, Ip } from "@nestjs/common";
import { AppService } from "./app.service";
import { Roles } from "./common/decorators/auth.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles([])
  getHello(@Ip() ip): string {
    return this.appService.getHello(ip);
  }
}

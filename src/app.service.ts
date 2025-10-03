import { Injectable, Ip } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(@Ip() ip): string {
    return `${ip} + evrything is ok`;
  }
}

import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { IJwtPayload } from "../../shared";

@Injectable()
export class MainMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    if (token != undefined) req.user = (await this.jwt.decode(token)) as IJwtPayload;

    req.id = crypto.randomUUID();
    console.log(req.user);
    next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type == "Bearer" ? token : undefined;
  }
}

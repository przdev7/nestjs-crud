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
    else req.user = undefined;

    this.extractRefreshFromCookie(req);
    req.id = crypto.randomUUID();
    next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type == "Bearer" ? token : undefined;
  }

  private extractRefreshFromCookie(req: Request) {
    for (const [key, value] of Object.entries(req.signedCookies)) {
      if (key === "refresh_token") return value;
    }

    return undefined;
  }
}

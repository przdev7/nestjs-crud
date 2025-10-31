import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { extractRefreshFromCookie, extractTokenFromHeader, IJwtPayload } from "../../shared";

@Injectable()
export class MainMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = extractTokenFromHeader(req) ?? extractRefreshFromCookie(req);
    if (token != undefined) req.user = (await this.jwt.decode(token)) as IJwtPayload;
    else req.user = undefined;

    req.id = crypto.randomUUID();
    next();
  }
}

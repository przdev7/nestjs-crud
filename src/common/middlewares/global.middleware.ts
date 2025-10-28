import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { extractTokenFromHeader, IJwtPayload } from "../../shared";

@Injectable()
export class MainMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = extractTokenFromHeader(req);
    if (token != undefined) req.user = (await this.jwt.decode(token)) as IJwtPayload;
    else req.user = undefined;

    console.log(req.user);

    req.id = crypto.randomUUID();
    next();
  }
}

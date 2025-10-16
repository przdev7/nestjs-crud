import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AUTH_TYPE, ROLES, IJwtPayload, roles, ICachePaylad } from "../../shared";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const authType = this.reflector.getAllAndOverride(AUTH_TYPE, [context.getHandler()]);
    const roles: roles[] = this.reflector.getAllAndOverride(ROLES, [context.getHandler()]);

    if (roles.length === 0) return true;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const secret =
        authType == "REFRESH"
          ? this.config.getOrThrow<string>("JWT_REFRESH_SECRET")
          : this.config.getOrThrow<string>("JWT_SECRET");
      const payload: IJwtPayload = await this.jwt.verifyAsync(token, {
        secret: secret,
      });

      const value = await this.cache.get<ICachePaylad>(payload.id.toString());
      if (!value || value.unAuthorized) throw new UnauthorizedException();

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    return type == "Bearer" ? token : undefined;
  }
}

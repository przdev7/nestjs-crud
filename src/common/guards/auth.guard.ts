import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AUTH_TYPE, ROLES, roles, jwtEnum, extractRefreshFromCookie, extractTokenFromHeader } from "../../shared";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    //FIXME: What if there will be access token & refresh, backend will throw unauthorzied even if u pass by cookies refresh?
    // Frontend should send only refresh for /refresh/ route to avoid this problem
    const token = extractTokenFromHeader(req) ?? extractRefreshFromCookie(req);

    const authType: jwtEnum = this.reflector.getAllAndOverride(AUTH_TYPE, [context.getHandler()]);
    const roles: roles[] = this.reflector.getAllAndOverride(ROLES, [context.getHandler()]);

    if (roles.length === 0) return true;
    if (!token) throw new UnauthorizedException();

    try {
      const secret =
        authType === "REFRESH"
          ? this.config.getOrThrow<string>("JWT_REFRESH_SECRET")
          : this.config.getOrThrow<string>("JWT_SECRET");

      await this.jwt.verifyAsync(token, {
        secret: secret,
      });

      const isAuthorized = await this.cache.get<boolean>(`${authType ?? "ACCESS"}:${req.user?.jti}`);
      if (!isAuthorized) throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

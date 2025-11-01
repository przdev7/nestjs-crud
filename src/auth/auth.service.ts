import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../users/dto/user.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { jwtEnum, JwtRefreshRawPayload, JwtRawPayload, JwtRefreshPayload } from "../shared";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import crypto from "crypto";
import ms from "ms";
@Injectable()
export class AuthService {
  constructor(
    private readonly user: UsersService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async signUp(data: CreateUserDTO): Promise<string> {
    await this.user.create(data);
    return "User created";
  }

  async signIn(data: LoginUserDTO): Promise<object> {
    const existingUser = await this.user.findOneOrThrow(data.email ?? data.username);
    if (!(await bcrypt.compare(data.password, existingUser.password))) throw new UnauthorizedException();

    //FIXME: temp solution i will fix this ineffective code
    const payload: JwtRawPayload = {
      sub: existingUser.id,
      iss: "auth-service",
      aud: "auth-service",
      jti: crypto.randomUUID(),
      email: existingUser.email,
      username: existingUser.username,
    };
    const payloadRefresh: JwtRefreshRawPayload = {
      sub: existingUser.id,
      iss: "auth-service",
      aud: "auth-service",
      jti: crypto.randomUUID(),
    };

    //3ms
    const token: string = await this.genJwt(payload, jwtEnum.ACCESS);
    const refresh: string = await this.genJwt(payloadRefresh, jwtEnum.REFRESH);
    return {
      token: token,
      refreshToken: refresh,
    };
  }

  async genJwt(payload: JwtRawPayload | JwtRefreshRawPayload, enumJwt: jwtEnum): Promise<string> {
    const exp = enumJwt === jwtEnum.ACCESS ? "5m" : "7d";
    const secret = enumJwt === jwtEnum.ACCESS ? this.config.get("JWT_SECRET") : this.config.get("JWT_REFRESH_SECRET");
    const token = await this.jwt.signAsync(payload, {
      expiresIn: exp,
      secret: secret,
    });

    await this.manageSession(enumJwt === jwtEnum.ACCESS ? "ACCESS" : "REFRESH", true, ms(exp), payload.jti);
    return token;
  }

  private async manageSession(
    enumJwt: keyof typeof jwtEnum,
    isAuthorized: boolean,
    ttl: number,
    jti: string,
  ): Promise<void> {
    await this.cache.set(`${enumJwt}:${jti}`, isAuthorized, ttl);
  }

  async changePassword(newPassword: string, payload: JwtRefreshPayload): Promise<string> {
    const user = await this.user.findOneByIdOrThrow(payload.sub);
    const ttl = (payload.exp - Math.floor(Date.now() / 1000)) * 1000;

    await this.manageSession("REFRESH", false, ttl, payload.jti);
    await this.user.update(await user.hashPassword(newPassword));
    return "password successfully changed, please login again.";
  }

  async refresh(payload: JwtRefreshRawPayload): Promise<string> {
    const user = await this.user.findOneByIdOrThrow(payload.sub);
    const newPayload: JwtRawPayload = {
      sub: user.id,
      iss: "auth-service",
      aud: "auth-service",
      jti: crypto.randomUUID(),
      email: user.email,
      username: user.username,
    };
    const token = await this.genJwt(newPayload, jwtEnum.ACCESS);
    return token;
  }

  async logout(payload: JwtRefreshPayload): Promise<string> {
    if (!(await this.cache.get(`REFRESH:${payload.jti}`))) throw new UnauthorizedException();
    const ttl = (payload.exp - Math.floor(Date.now() / 1000)) * 1000;

    await this.manageSession("REFRESH", false, ttl, payload.jti);
    return "logout successful";
  }
}

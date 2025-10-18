import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../users/dto/user.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { jwtTypes, IJwtPayload } from "../shared";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import crypto from "crypto";

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
    const existingUser = await this.user.findOne(data.email ?? data.username);
    if (!existingUser) throw new UnauthorizedException();
    if (!(await bcrypt.compare(data.password, existingUser.password))) throw new UnauthorizedException();

    //FIXME: temp solution i will fix this ineffective code
    const payload: Omit<IJwtPayload, "exp"> = {
      sub: existingUser.id.toString(),
      iat: +new Date(),
      iss: "auth-service",
      aud: "auth-service",
      jti: crypto.randomUUID(),
      email: existingUser.email,
      username: existingUser.username,
    };
    // const payloadRefresh: Omit<IJwtPayload, "exp" | "email" | "username"> = {
    //   sub: existingUser.id.toString(),
    //   iat: +new Date(),
    //   iss: "auth-service",
    //   aud: "auth-service",
    //   jti: crypto.randomUUID(),
    // };

    //3ms
    const token: string = await this.genJwt(payload, jwtTypes.ACCESS);
    const refresh: string = await this.genJwt(payload, jwtTypes.REFRESH);

    return {
      token: token,
      refreshToken: refresh,
    };
  }

  async genJwt(payload: Omit<IJwtPayload, "exp">, type: jwtTypes): Promise<string> {
    const expiresIn = type === jwtTypes.ACCESS ? ms("5min") : ms("7d");
    const secret = type === jwtTypes.ACCESS ? this.config.get("JWT_SECRET") : this.config.get("JWT_REFRESH_SECRET");

    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });
    const { exp, jti }: IJwtPayload = await this.jwt.decode(token);

    const ttlRefresh = exp - +Date.now();
    await this.cache.set(`blacklist:${jti}`, true, ttlRefresh);

    return token;
  }

  async changePassword(newPassword: string, data: Omit<IJwtPayload, "exp">): Promise<string> {
    const user = await this.user.findOne(data.email);
    if (!user) throw new UnauthorizedException();
    await this.user.update(await user.hashPassword(newPassword));
    return "password successfully changed";
  }

  async refresh(payload: Omit<IJwtPayload, "exp">): Promise<string> {
    const token = await this.genJwt(payload, jwtTypes.ACCESS);
    return token;
  }

  async logout(data: IJwtPayload): Promise<string> {
    const user = await this.user.findOne(data.email);
    if (!user || !(await this.cache.get(`blacklist:${data.jti}`))) throw new UnauthorizedException();

    const ttl = data.exp - +Date.now();
    await this.cache.set(`blacklist:${data.jti}`, false, ttl);

    return "logout successful";
  }
}

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../users/dto/user.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { jwtTypes, IJwtPayload, ICachePaylad } from "../shared";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";

//FIXME: Bad optimalization
/**
 * This auth system has poor performance,
 * this is first version of this, i need to do this better.
 * Im thinking of creating blacklist instead of authorized tokens
 * but Im not sure how that would work, but I have idea with blacklisting JTI.
 */
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

    //FIXME: Creating payload with jti for refresh token
    const payload: IJwtPayload = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };

    //3ms
    const token: string = await this.genJwt(payload, jwtTypes.ACCESS);
    const refresh: string = await this.genJwt(payload, jwtTypes.REFRESH);

    //FIXME: Change redis record TTL to refresh token TTL
    await this.cache.set<ICachePaylad>(
      existingUser.id.toString(),
      { token: token, refresh: refresh, unAuthorized: false },
      ms("7d"),
    );

    return {
      token: token,
      refreshToken: refresh,
    };
  }

  async genJwt(payload: object, type: jwtTypes): Promise<string> {
    const expiresIn = type === jwtTypes.ACCESS ? ms("5min") : ms("7d");
    const secret = type === jwtTypes.ACCESS ? this.config.get("JWT_SECRET") : this.config.get("JWT_REFRESH_SECRET");

    return await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });
  }

  async changePassword(newPassword: string, data: IJwtPayload): Promise<string> {
    const user = await this.user.findOne(data.email);
    if (!user) throw new UnauthorizedException();

    const value = await this.cache.get<ICachePaylad>(user.id.toString());
    if (!value) throw new UnauthorizedException();

    value.unAuthorized = true;
    await this.cache.set(user.id.toString(), value);

    await this.user.update(await user.hashPassword(newPassword));
    return "password successfully changed";
  }

  async refresh(payload: IJwtPayload): Promise<string> {
    return await this.genJwt(payload, jwtTypes.ACCESS);
  }

  async logout(data: IJwtPayload): Promise<string> {
    const user = await this.user.findOne(data.email);
    if (!user) throw new UnauthorizedException();

    const value = await this.cache.get<ICachePaylad>(user.id.toString());
    if (!value) throw new UnauthorizedException();

    value.unAuthorized = true;
    await this.cache.set(user.id.toString(), value);

    return "logout successful";
  }
}

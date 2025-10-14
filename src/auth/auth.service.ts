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

    const payload: IJwtPayload = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };

    const token: string = await this.genJwt(payload, jwtTypes.ACCESS);
    const refresh: string = await this.genJwt(payload, jwtTypes.REFRESH);

    await this.cache.set(`${existingUser.id}`, { token: token, refresh: refresh }, ms("5m"));

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

  //FIXME: Unauthorize old jwt token after this method
  async changePassword(newPassword: string, data: IJwtPayload): Promise<string> {
    const user = await this.user.findOne(data.email);
    if (!user) throw new UnauthorizedException();

    await this.user.update(await user.hashPassword(newPassword));
    return "password successfully changed";
  }

  async refresh(payload: IJwtPayload) {
    return await this.genJwt(payload, jwtTypes.ACCESS);
  }
}

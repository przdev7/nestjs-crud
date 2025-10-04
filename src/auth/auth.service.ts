import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { jwtTypes } from "./auth.decorator";

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UsersService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(data: CreateUserDTO): Promise<string> {
    data.password = await bcrypt.hash(data.password, 10);
    await this.user.create(data);
    return "User created";
  }

  async signIn(data: LoginUserDTO): Promise<object> {
    const existingUser = await this.user.findOne(data.email ?? data.username);
    if (!existingUser) throw new UnauthorizedException();
    if (!(await bcrypt.compare(data.password, existingUser.password))) throw new UnauthorizedException();

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };

    return {
      token: await this.genJwt(payload, "ACCESS"),
      refreshToken: await this.genJwt(payload, "REFRESH"),
    };
  }

  async genJwt(payload: object, type: keyof jwtTypes): Promise<string> {
    const expiresIn = type === "ACCESS" ? ms("7d") : ms("30d");
    const secret = type === "ACCESS" ? this.config.get("JWT_SECRET") : this.config.get("JWT_REFRESH_SECRET");

    return await this.jwt.signAsync(payload, {
      expiresIn: expiresIn,
      secret: secret,
    });
  }

  async refresh(payload: object) {
    return await this.genJwt(payload, "ACCESS");
  }
}

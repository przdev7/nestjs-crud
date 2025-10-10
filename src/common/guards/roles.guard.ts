import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { UsersService } from "../../users/users.service";
import { Reflector } from "@nestjs/core";
import { ROLES } from "../../shared";
import { roles } from "../../shared/enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly user: UsersService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const rolesDecorator: roles[] = this.reflector.getAllAndOverride(ROLES, [context.getHandler()]);
    if (rolesDecorator.length === 0) return true;

    const user = await this.user.findOne(request.user.email);
    if (!user) throw new UnauthorizedException();

    console.log(user.roles.map((role) => rolesDecorator.includes(role)));
    if (!user.roles.map((role) => rolesDecorator.includes(role))) throw new UnauthorizedException();

    return true;
  }
}

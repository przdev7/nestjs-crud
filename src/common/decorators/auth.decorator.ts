import { SetMetadata } from "@nestjs/common";
import { jwtEnum, AUTH_TYPE, ROLES, roles } from "../../shared";

export const AuthType = (enumJwt: jwtEnum) => SetMetadata<string, jwtEnum>(AUTH_TYPE, enumJwt);
export const Roles = (roles: roles[]) => SetMetadata<string, roles[]>(ROLES, roles);

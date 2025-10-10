import { SetMetadata } from "@nestjs/common";
import { jwtTypes, AUTH_TYPE, ROLES, roles } from "../../shared";

export const AuthType = (type: jwtTypes) => SetMetadata<string, jwtTypes>(AUTH_TYPE, type);
export const Roles = (roles: roles[]) => SetMetadata<string, roles[]>(ROLES, roles);

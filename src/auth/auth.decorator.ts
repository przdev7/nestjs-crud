import { SetMetadata } from "@nestjs/common";
import { jwtTypes, IS_PUBLIC, AUTH_TYPE } from "../shared";

export const Public = () => SetMetadata(IS_PUBLIC, true);
export const AuthType = (type: jwtTypes) => SetMetadata<string, jwtTypes>(AUTH_TYPE, type);

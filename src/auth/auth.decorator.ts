import { SetMetadata } from "@nestjs/common";

// TODO: Create a file that will contain all the constants and move the constants from here to this file

export interface jwtTypes {
  REFRESH;
  ACCESS;
}

export const IS_PUBLIC = "isPublic";
export const AUTH_TYPE = "AuthType";

export const Public = () => SetMetadata(IS_PUBLIC, true);
export const AuthType = (type: keyof jwtTypes) => SetMetadata<string, keyof jwtTypes>(AUTH_TYPE, type);

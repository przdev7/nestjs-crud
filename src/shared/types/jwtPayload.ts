import type { JwtPayload as BaseJwtPayload } from "jsonwebtoken";

type StrictJwtPayload = Omit<BaseJwtPayload, string> & {
  iss?: string;
  sub?: number;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  jti?: string;
};

export type JwtPayload = Required<StrictJwtPayload> & {
  username: string;
  email: string;
};
export type JwtRawPayload = Omit<JwtPayload, "exp" | "iat">;

export type JwtRefreshPayload = Omit<JwtPayload, "email" | "username">;
export type JwtRefreshRawPayload = Omit<JwtRefreshPayload, "exp" | "iat">;

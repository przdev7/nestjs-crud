import type { JwtPayload as BaseJwtPayload } from "jsonwebtoken";

type StrictJwtPayload = Omit<BaseJwtPayload, string> & {
  iss?: string;
  sub?: number;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  jti?: string;
};

export interface IJwtPayload extends Required<StrictJwtPayload> {
  username: string;
  email: string;
}

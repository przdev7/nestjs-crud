import { JwtPayload, JwtRefreshPayload } from "..";
import type { Request } from "express";
export interface IAuthRequest extends Request {
  user: JwtPayload | JwtRefreshPayload;
}

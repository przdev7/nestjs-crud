import { IJwtPayload } from "..";
import type { Request } from "express";

export interface IAuthRequest extends Request {
  user: IJwtPayload;
}

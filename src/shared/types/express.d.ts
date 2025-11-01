import type { IJwtPayload, IJwtRefreshPayload } from "./jwtPayload";

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: IJwtPayload | IJwtRefreshPayload;
    }
  }
}

export {};

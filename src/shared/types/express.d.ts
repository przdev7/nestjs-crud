import IJwtPayload from "./jwtPayload";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

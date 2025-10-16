import IJwtPayload from "./IjwtPayload";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

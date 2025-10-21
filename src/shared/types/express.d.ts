import IJwtPayload from "./IjwtPayload";

declare global {
  namespace Express {
    interface Request {
      id: string;
      user: IJwtPayload;
    }
  }
}

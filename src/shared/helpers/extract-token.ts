import { Request } from "express";

export function extractTokenFromHeader(req: Request): string | undefined {
  const [type, token] = req.headers.authorization?.split(" ") ?? [];
  return type == "Bearer" ? token : undefined;
}

export function extractRefreshFromCookie(req: Request) {
  for (const [key, value] of Object.entries(req.signedCookies)) {
    if (key === "refresh_token" && typeof value == "string") return value;
  }

  return undefined;
}

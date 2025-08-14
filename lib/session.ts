// /src/lib/session.ts
import { IronSessionOptions } from "iron-session";

export interface AdminSession {
  isLoggedIn?: boolean;
  username?: string;
}

export const sessionOptions: IronSessionOptions = {
  cookieName: process.env.IRON_SESSION_COOKIE_NAME || "admin_session",
  password: process.env.IRON_SESSION_PASSWORD as string,
  ttl: Number(process.env.IRON_SESSION_TTL || 60 * 60 * 24), // 1 día
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

declare module "iron-session" {
  interface IronSessionData extends AdminSession {}
}

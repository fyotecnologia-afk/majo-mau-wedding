import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions, AdminSession } from "../../../../lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: IronSession<AdminSession> = await getIronSession(req, res, sessionOptions);
  const isLoggedIn = Boolean(session.isLoggedIn);
  res.status(200).json({ isLoggedIn, username: session.username || null });
}

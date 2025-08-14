// /src/pages/api/admin/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../../../../lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession(req, res, sessionOptions);
  const isLoggedIn = Boolean(session.isLoggedIn);
  res.status(200).json({ isLoggedIn, username: session.username || null });
}

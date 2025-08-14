// /src/pages/api/admin/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getIronSession(req, res, sessionOptions);
  session.destroy();
  await session.save(); // Esto fuerza la escritura de la cookie vacía
  res.status(200).json({ success: true });
}

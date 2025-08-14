// /src/pages/api/admin/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions, AdminSession } from "../../../../lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validaciones rápidas para evitar cuelgues en Vercel
    if (!process.env.IRON_SESSION_PASSWORD) {
      return res.status(500).json({ error: "IRON_SESSION_PASSWORD no está definido." });
    }

    if (process.env.IRON_SESSION_PASSWORD.length < 32) {
      return res.status(500).json({ error: "IRON_SESSION_PASSWORD debe tener al menos 32 caracteres." });
    }

    const session: IronSession<AdminSession> = await getIronSession(req, res, sessionOptions);

    const isLoggedIn = Boolean(session.isLoggedIn);
    return res.status(200).json({
      isLoggedIn,
      username: session.username || null,
    });

  } catch (error) {
    console.error("❌ Error en /api/admin/session:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

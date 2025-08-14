// /src/pages/api/admin/session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSession } from "iron-session";
import { sessionOptions, AdminSession } from "../../../../lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validamos que la variable de entorno exista y tenga al menos 32 caracteres
    if (!process.env.IRON_SESSION_PASSWORD || process.env.IRON_SESSION_PASSWORD.length < 32) {
      throw new Error("IRON_SESSION_PASSWORD no está definida o es demasiado corta (mínimo 32 caracteres)");
    }

    // Obtenemos la sesión
    const session: IronSession<AdminSession> = await getIronSession(req, res, sessionOptions);

    // Convertimos isLoggedIn a boolean
    const isLoggedIn = Boolean(session.isLoggedIn);

    // Respondemos
    res.status(200).json({
      isLoggedIn,
      username: session.username || null,
    });
  } catch (err: any) {
    console.error("[SESSION ERROR]:", err);

    // Respondemos con error 500
    res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
}

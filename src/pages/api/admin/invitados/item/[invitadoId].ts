import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { Estado, CategoriaInvitado } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { invitadoId } = req.query as { invitadoId: string };

  try {
    if (req.method === "PUT") {
      const { nombre, principal, categoria, estado } = req.body;
      const updated = await db.invitado.update({
        where: { id: invitadoId },
        data: {
          nombre,
          principal: principal ?? null,
          categoria: categoria as CategoriaInvitado | null,
          estado: (estado as Estado) ?? "ACTIVO",
        },
      });
      res.status(200).json(updated);
      return;
    }

    if (req.method === "PATCH") {
      const { estado } = req.body as { estado: Estado };
      const updated = await db.invitado.update({
        where: { id: invitadoId },
        data: { estado },
      });
      res.status(200).json(updated);
      return;
    }

    res.setHeader("Allow", "PUT, PATCH");
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}

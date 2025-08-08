import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../lib/db";

type Respuesta = "SI" | "NO" | null;

interface Invitado {
  id: string;
  nombre: string;
  respuesta: Respuesta;
}

interface Dedicatoria {
  id: string;
  texto: string;
  fecha: string;
}

interface InvitacionData {
  id: string;
  numeroInvitacion: string;
  url: string;
  invitados: Invitado[];
  dedicatorias: Dedicatoria[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ datos?: InvitacionData[]; error?: string }>
) {
  try {
    const invitaciones = await db.invitacion.findMany({
      where: { estado: "ACTIVO" },
      include: {
        invitados: {
          where: { estado: "ACTIVO" },
          include: {
            confirmacionInvitados: {
              include: { confirmacion: true },
            },
          },
        },
        confirmaciones: true,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const datos: InvitacionData[] = invitaciones.map((inv) => {
      const codigo = Buffer.from(inv.numero).toString("base64");
      const url = `${baseUrl}/${encodeURIComponent(codigo)}`;

      const invitados: Invitado[] = inv.invitados.map((invitado) => {
        const confirmacionInv = invitado.confirmacionInvitados[0];
        return {
          id: invitado.id,
          nombre: invitado.nombre,
          respuesta: confirmacionInv ? confirmacionInv.respuesta : null,
        };
      });

      const dedicatorias: Dedicatoria[] = inv.confirmaciones.map((c) => ({
        id: c.id,
        texto: c.dedicatoria,
        fecha: c.createdAt.toISOString(),
      }));

      return {
        id: inv.id,
        numeroInvitacion: inv.numero,
        url,
        invitados,
        dedicatorias,
      };
    });

    res.status(200).json({ datos });
  } catch (error) {
    console.error("Error al generar lista:", error);
    res.status(500).json({ error: "Error generando lista" });
  }
}

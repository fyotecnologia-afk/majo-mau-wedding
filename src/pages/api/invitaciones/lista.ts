import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../lib/db";

type Respuesta = "SI" | "NO" | null;

interface Invitado {
  id: string;
  nombre: string;
  respuesta: Respuesta;
  principal?: boolean;
  categoria?: string;
  estado?: string;
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
  hostedBy?: string;
  tipo?: string;
  familia?: string;
  saveTheDate?: boolean;
  invitacionEnviada?: boolean;
  especial?: boolean;
  tanteo?: number;
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
      select: {
        id: true,
        numero: true,
        hostedBy: true,
        tipo: true,
        familia: true,
        saveTheDate: true,
        invitacionEnviada: true,
        especial: true,
        tanteo: true,
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
          principal: invitado.principal,
          categoria: invitado.categoria,
          estado: invitado.estado,
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
        hostedBy: inv.hostedBy,
        tipo: inv.tipo,
        familia: inv.familia,
        saveTheDate: inv.saveTheDate,
        invitacionEnviada: inv.invitacionEnviada,
        especial: inv.especial,
        tanteo: inv.tanteo,
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

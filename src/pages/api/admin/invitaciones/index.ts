// src/pages/api/admin/invitaciones/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { Estado, CategoriaInvitado } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { q, estado, page = "1", pageSize = "10" } = req.query;
      const where: any = {};

      if (estado === "ACTIVO" || estado === "INACTIVO") where.estado = estado;
      if (q && typeof q === "string") {
        where.OR = [
          { numero: { contains: q } },
          { familia: { contains: q } },
          { tipo: { contains: q } },
          { hostedBy: { contains: q } },
        ];
      }

      const skip = (Number(page) - 1) * Number(pageSize);

      // Traemos invitaciones con invitados y confirmaciones
      const [items, total] = await Promise.all([
        db.invitacion.findMany({
          where,
          orderBy: { numero: "asc" },
          skip,
          take: Number(pageSize),
          include: {
            invitados: true,
            confirmaciones: {
              include: {
                confirmacionInvitados: true,
              },
            },
          },
        }),
        db.invitacion.count({ where }),
      ]);

      // Calculamos todos los conteos correctamente
      const itemsWithCounts = items.map((inv) => {
        const conteoInvitados = inv.invitados?.length || 0;

        // Mapeamos invitados a sus respuestas
        const invitadosConfirmadosMap: Record<string, "SI" | "NO"> = {};
        inv.confirmaciones.forEach((c) => {
          c.confirmacionInvitados?.forEach((ci) => {
            invitadosConfirmadosMap[ci.invitadoId] = ci.respuesta;
          });
        });

        let conteoConfirmados = 0;
        let conteoNoConfirmados = 0;

        Object.values(invitadosConfirmadosMap).forEach((r) => {
          if (r === "SI") conteoConfirmados++;
          if (r === "NO") conteoNoConfirmados++;
        });

        const conteoSinRespuesta = conteoInvitados - (conteoConfirmados + conteoNoConfirmados);

        return {
          ...inv,
          conteoInvitados,
          conteoConfirmados,
          conteoNoConfirmados,
          conteoSinRespuesta,
        };
      });

      res.status(200).json({ items: itemsWithCounts, total });
      return;
    }

    if (req.method === "POST") {
      const {
        numero,
        hostedBy,
        tipo,
        familia,
        saveTheDate,
        invitacionEnviada,
        especial,
        tanteo,
        invitados = [],
      } = req.body;

      const created = await db.invitacion.create({
        data: {
          numero,
          hostedBy: hostedBy ?? null,
          tipo: tipo ?? null,
          familia: familia ?? null,
          saveTheDate: saveTheDate ?? null,
          invitacionEnviada: invitacionEnviada ?? null,
          especial: especial ?? null,
          tanteo: tanteo ?? null,
          invitados: {
            create: invitados.map((i: any) => ({
              nombre: i.nombre,
              principal: i.principal ?? null,
              categoria: i.categoria as CategoriaInvitado | null,
              estado: (i.estado as Estado) ?? "ACTIVO",
            })),
          },
        },
      });

      res.status(201).json(created);
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// pages/api/invitaciones/[numero].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const numero = req.query.numero as string;

  try {
    const invitacion = await db.invitacion.findUnique({
      where: { numero },
      include: {
        invitados: {
          where: { estado: 'ACTIVO' },
          select: { id: true, nombre: true },
        },
        confirmaciones: {
          orderBy: { createdAt: 'asc' }, // Para contar la primera y segunda confirmación
          include: {
            confirmacionInvitados: {
              select: { invitadoId: true, respuesta: true },
            },
          },
        },
      },
    });

    if (!invitacion) {
      return res.status(404).json({ exists: false });
    }

    // Tomar dedicatoria de la confirmación más reciente
    const dedicatoria =
      invitacion.confirmaciones.length > 0
        ? invitacion.confirmaciones[invitacion.confirmaciones.length - 1].dedicatoria
        : "";

    res.status(200).json({
      exists: true,
      estado: invitacion.estado,
      invitados: invitacion.invitados,
      confirmaciones: invitacion.confirmaciones,
      dedicatoria,
    });
  } catch (error) {
    console.error("Error en la API de invitaciones:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { numero, asistentes, dedicatoria } = req.body;

  const invitacion = await db.invitacion.findUnique({
    where: { numero },
    include: { confirmaciones: true },
  });

  if (!invitacion) return res.status(404).end();

  if (invitacion.confirmaciones.length >= 2) {
    return res.status(403).json({ error: 'Máximo de confirmaciones alcanzado' });
  }

  try {
    // 1. Crear la confirmación
    const confirmacion = await db.confirmacion.create({
      data: {
        dedicatoria,
        invitacionId: invitacion.id,
      },
    });

    // 2. Asociar los invitados a través de ConfirmacionInvitado
    await Promise.all(
      asistentes.map((invitadoId: string) =>
        db.confirmacionInvitado.create({
          data: {
            confirmacionId: confirmacion.id,
            invitadoId,
          },
        })
      )
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear confirmación' });
  }
}

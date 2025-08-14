import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { numero, asistentes = [], dedicatoria = '' } = req.body;

  if (!numero) return res.status(400).json({ error: 'Falta número de invitación' });

  try {
    // Buscar invitacion y la confirmacion más reciente
    const invitacion = await db.invitacion.findUnique({
      where: { numero },
      include: {
        invitados: true, // para poder hacer upsert para todos los invitados
        confirmaciones: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { confirmacionInvitados: true },
        },
      },
    });

    if (!invitacion) return res.status(404).json({ error: 'Invitación no encontrada' });

    let confirmacionId: string;

    if (invitacion.confirmaciones.length > 0) {
      // Existe confirmacion previa
      const ultimaConfirmacion = invitacion.confirmaciones[0];
      confirmacionId = ultimaConfirmacion.id;

      // Actualizar dedicatoria
      await db.confirmacion.update({
        where: { id: confirmacionId },
        data: { dedicatoria },
      });
    } else {
      // Crear nueva confirmacion
      const nuevaConfirmacion = await db.confirmacion.create({
        data: {
          dedicatoria,
          invitacionId: invitacion.id,
        },
      });
      confirmacionId = nuevaConfirmacion.id;
    }

    // Para cada invitado, upsert en ConfirmacionInvitado con respuesta SI/NO según asistentes[]
    await Promise.all(
      invitacion.invitados.map((invitado) => {
        const respuesta = asistentes.includes(invitado.id) ? 'SI' : 'NO';
        return db.confirmacionInvitado.upsert({
          where: {
            confirmacionId_invitadoId: {
              confirmacionId,
              invitadoId: invitado.id,
            },
          },
          update: { respuesta },
          create: {
            confirmacionId,
            invitadoId: invitado.id,
            respuesta,
          },
        });
      })
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error procesando confirmación' });
  }
}

// pages/api/invitaciones/lista.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const invitaciones = await db.invitacion.findMany({
      where: { estado: 'ACTIVO' },
      select: { numero: true },
    });

    const urls = invitaciones.map((inv) => {
      const codigo = Buffer.from(inv.numero).toString('base64');
      return `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${encodeURIComponent(codigo)}`;
    });

    res.status(200).json({ urls });
  } catch (error) {
    console.error('Error al generar lista:', error);
    res.status(500).json({ error: 'Error generando lista' });
  }
}

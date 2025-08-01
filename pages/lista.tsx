// pages/api/lista.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Estado } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const invitaciones = await prisma.invitacion.findMany({
      where: { estado: Estado.ACTIVO },
      select: { numero: true, id: true },
    });

    if (!invitaciones.length) {
      return res.status(404).json({ message: 'No hay invitaciones activas' });
    }

    const urls = invitaciones.map((inv) => {
      const codigo = Buffer.from(inv.numero).toString('base64');
      return `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${encodeURIComponent(codigo)}`;
    });

    res.status(200).json({ urls });
  } catch (error) {
    console.error('Error fetching invitaciones:', error);
    res.status(500).json({ error: 'Error al obtener las invitaciones' });
  }
}

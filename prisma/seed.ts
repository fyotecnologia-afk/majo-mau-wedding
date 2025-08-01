import { PrismaClient, Estado } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear invitación activa con invitados activos e inactivos
  const invitacion = await prisma.invitacion.create({
    data: {
      numero: "1234ABCD",
      estado: Estado.ACTIVO,
      invitados: {
        create: [
          { nombre: "Juan Pérez", estado: Estado.ACTIVO },
          { nombre: "María López", estado: Estado.ACTIVO },
          { nombre: "Carlos Gómez", estado: Estado.INACTIVO },
        ],
      },
    },
    include: {
      invitados: true,
    },
  });

  console.log("Invitación creada:", invitacion);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

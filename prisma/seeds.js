const { PrismaClient, Estado } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Crear la invitación con invitados
  const invitacion = await prisma.invitacion.create({
    data: {
      numero: '1234ABCD',
      estado: Estado.ACTIVO,
      invitados: {
        create: [
          { nombre: 'Juan Pérez', estado: Estado.ACTIVO },
          { nombre: 'María López', estado: Estado.ACTIVO },
          { nombre: 'Carlos Gómez', estado: Estado.INACTIVO },
        ],
      },
    },
    include: {
      invitados: true,
    },
  });

  console.log('Invitación creada:', invitacion);

  // Crear una confirmación relacionada con la invitación
  const confirmacion = await prisma.confirmacion.create({
    data: {
      dedicatoria: '¡Gracias por la invitación!',
      invitacionId: invitacion.id,
      confirmacionInvitados: {
        create: invitacion.invitados
          .filter(i => i.estado === Estado.ACTIVO)
          .map(inv => ({
            invitadoId: inv.id,
          })),
      },
    },
  });

  console.log('Confirmación creada:', confirmacion);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

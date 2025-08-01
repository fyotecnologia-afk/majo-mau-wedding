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
  include: { invitados: true },
});

const confirmacion = await prisma.confirmacion.create({
  data: {
    dedicatoria: "Confirmamos con gusto",
    invitacionId: invitacion.id,
    confirmacionInvitados: {
      create: [
        {
          invitadoId: invitacion.invitados[0].id,
        },
        {
          invitadoId: invitacion.invitados[1].id,
        },
      ],
    },
  },
});

console.log("✅ Confirmación creada:", confirmacion.id);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedData = require("../seedData").seedData; // o la ruta correcta a tu archivo seedData.js

async function main() {
  for (const inv of seedData) {
    await prisma.invitacion.create({
      data: {
        numero: inv.numero,
        hostedBy: inv.hostedBy,
        tipo: inv.tipo,
        familia: inv.familia,
        saveTheDate: inv.saveTheDate,
        invitacionEnviada: inv.invitacionEnviada,
        especial: inv.especial,
        tanteo: inv.tanteo,
        invitados: {
          create: inv.invitados.map((i) => ({
            nombre: i.nombre,
            principal: i.principal,
            categoria: i.categoria,
            estado: i.estado || "ACTIVO", // si quieres poner default
            // Si quieres relacionar confirmaciones u otros datos aquí también
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

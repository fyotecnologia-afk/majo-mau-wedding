const { db } = require('../src/lib/db.ts'); // Ajusta la ruta según tu proyecto

async function main() {
  try {
    const existente = await db.parametrosGlobales.findFirst();
    if (existente) {
      console.log("Ya existe un registro de parámetros globales.");
      process.exit(0);
    }

    const registro = await db.parametrosGlobales.create({
      data: {
        fechaLimite: new Date('2025-08-17T23:59:59'),
        intentosMaximos: 2
      }
    });

    console.log("Parámetros globales cargados:", registro);
    process.exit(0);
  } catch (error) {
    console.error("Error cargando parámetros globales:", error);
    process.exit(1);
  }
}

main();

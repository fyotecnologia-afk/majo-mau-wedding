const fs = require("fs");
const path = require("path");

const csvFilePath = path.resolve(__dirname, "invitados.csv");

function parseRow(row) {
  const [
    hostedBy,
    tipo,
    numero,
    familia,
    principal,
    nombreInvitado,
    categoria,
    saveTheDate,
    invitacion,
    especial,
    tanteo,
  ] = row.split("\t").map((c) => c.trim());

  return {
    hostedBy,
    tipo,
    numero,
    familia,
    principal: principal === "1",
    nombreInvitado,
    categoria: categoria === "A" ? "ADULTO" : "NINO",
    saveTheDate: saveTheDate === "1",
    invitacionEnviada: invitacion === "1",
    especial: especial === "1",
    tanteo: tanteo ? Number(tanteo) : null,
  };
}

function groupByNumero(data) {
  const map = new Map();

  data.forEach((item) => {
    if (!map.has(item.numero)) {
      map.set(item.numero, {
        hostedBy: item.hostedBy,
        tipo: item.tipo,
        numero: item.numero,
        familia: item.familia,
        saveTheDate: item.saveTheDate,
        invitacionEnviada: item.invitacionEnviada,
        especial: item.especial,
        tanteo: item.tanteo,
        invitados: [],
      });
    }

    map.get(item.numero).invitados.push({
      nombre: item.nombreInvitado,
      principal: item.principal,
      categoria: item.categoria,
      estado: "ACTIVO",
    });
  });

  return Array.from(map.values());
}

fs.readFile(csvFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error leyendo CSV:", err);
    return;
  }

  const rows = data.trim().split("\n");

  // Si tienes encabezados en CSV, quita esta línea o ajusta:
  // const rowsData = rows.slice(1);
  const rowsData = rows; // Si no tienes encabezados, usa esta línea

  const parsed = rowsData.map(parseRow);
  const grouped = groupByNumero(parsed);

  // Aquí tienes el arreglo listo para usar en seed
  fs.writeFileSync(path.resolve(__dirname, "seedData.js"), "const seedData = " + JSON.stringify(grouped, null, 2) + ";\nmodule.exports = { seedData };\n");
console.log("Archivo seedData.js generado.");
});

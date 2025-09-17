const xlsx = require("xlsx");
const { MongoClient } = require("mongodb");

// Mapeo de siglas a NIT
const sedesNIT = [
  { nit: "900148265", sigla_sede: "V" },
  { nit: "800185449", sigla_sede: "CASM" },
  { nit: "800185449", sigla_sede: "ACM" },
  { nit: "900777755", sigla_sede: "DIAC" },
  { nit: "800185449", sigla_sede: "ACI" },
  { nit: "800200789", sigla_sede: "ACC" }
];

function obtenerNITdesdeFactura(factura) {
  if (!factura) return null;
  const sede = sedesNIT.find(s => factura.startsWith(s.sigla_sede));
  return sede ? sede.nit : null;
}

async function excelBufferToMongo(buffer, config) {
  const uri = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_SERVER}:${config.MONGO_PORT}/${config.BASE_DATOS}?authSource=admin`;
  const cliente = new MongoClient(uri);

  try {
    // Leer directamente desde buffer
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const primeraHoja = workbook.SheetNames[0];
    const datos = xlsx.utils.sheet_to_json(workbook.Sheets[primeraHoja], { defval: "" });

    const registrosProcesados = datos.map(row => {
      const numeroFactura = `${row["PREFIJO"] || ""}${row["FACTURA"] || ""}`.trim();

      return {
        idRadicado: row["ID"],
        numeroFactura,
        fechaRadicacion: row["FECHA RADICACION DYG"] || null,
        estado: row["ESTADO POR AGRUPACION"] || null,
        radicacion: row["RADICACION"] || null,
        NIT: obtenerNITdesdeFactura(numeroFactura),
      };
    });

    await cliente.connect();
    const db = cliente.db(config.BASE_DATOS);
    const coleccion = db.collection(config.COLECCION);

    if (registrosProcesados.length > 0) {
      await coleccion.insertMany(registrosProcesados);
      console.log(`✅ ${registrosProcesados.length} registros insertados en MongoDB.`);
    } else {
      console.log("⚠️ El Excel no contiene registros válidos.");
    }
  } catch (err) {
    console.error("🚨 Error al insertar en MongoDB:", err.message);
  } finally {
    await cliente.close();
  }
}

module.exports = { excelBufferToMongo };

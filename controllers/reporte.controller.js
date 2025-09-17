const Reporte = require("../models/reporte.model");
const { login, consultarReporte, descargarReporteBuffer } = require("../services/reporte.service");
const { excelBufferToMongo } = require("../helpers/excelToMongo");

function getFechaAnterior() {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const yyyy = ayer.getFullYear();
  const mm = String(ayer.getMonth() + 1).padStart(2, "0");
  const dd = String(ayer.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

async function generarReporte(user, pass) {
  try {
    const fecha = getFechaAnterior();
    const date1 = fecha;
    const date2 = fecha;

    // 1. Login con credenciales específicas
    const cookies = await login(user, pass);

    // 2. Obtener link del reporte
    const link = await consultarReporte(date1, date2, cookies);

    // 3. Descargar como buffer
    const buffer = await descargarReporteBuffer(link, cookies);

    // 4. Procesar buffer y subir a Mongo
    await excelBufferToMongo(buffer, {
      MONGO_USER: process.env.MONGO_USER,
      MONGO_PASSWORD: process.env.MONGO_PASSWORD,
      MONGO_SERVER: process.env.MONGO_SERVER,
      MONGO_PORT: process.env.MONGO_PORT,
      COLECCION: process.env.COLECCION,
      BASE_DATOS: process.env.BASE_DATOS,
    });

    const reporte = new Reporte({
      usuario: user,
      fechaInicio: date1,
      fechaFin: date2,
      archivo: "cargado en MongoDB",
    });

    console.log(`✅ Reporte cargado en MongoDB para usuario ${user}`);
    return reporte;
  } catch (error) {
    console.error(`🚨 Error al generar reporte con usuario ${user}:`, error.message);
    throw error;
  }
}

module.exports = { generarReporte };

require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const { generarReporte } = require("./controllers/reporte.controller");

const app = express();
const reporteRoutes = require("./routes/reporte.routes");

app.use("/api", reporteRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

    // Ejecutar cada día a las 08:00 AM
    cron.schedule("1 4 * * *", async () => {
      console.log("⏰ Ejecutando tarea programada de reportes (3 usuarios)");

      const usuarios = [
        { user: process.env.FIDU_USER1, pass: process.env.FIDU_PASS1 },
        { user: process.env.FIDU_USER2, pass: process.env.FIDU_PASS2 },
        { user: process.env.FIDU_USER3, pass: process.env.FIDU_PASS3 },
      ];

      for (const cred of usuarios) {
        try {
          await generarReporte(cred.user, cred.pass);
        } catch (err) {
          console.error("🚨 Fallo con credenciales:", cred.user, err.message);
        }
      }
    });
    console.log("✅ Tarea programada configurada para las 08:00 AM cada día");
  });
}

module.exports = app;

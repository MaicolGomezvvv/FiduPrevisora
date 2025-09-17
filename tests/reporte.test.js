const request = require("supertest");
const app = require("../app");
const fs = require("fs");
const path = require("path");

describe("API de Reporte Fiduprevisora", () => {
  jest.setTimeout(30000); // aumenta el timeout (30s)

  it("debería generar y descargar el reporte con nombre único", async () => {
    const date1 = "20250901";
    const date2 = "20250916";

    const response = await request(app)
      .get("/api/reporte")
      .query({ date1, date2 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reporte");

    const reporte = response.body.reporte;
    expect(reporte).toHaveProperty("archivo");

    // Verificar que el archivo exista y coincida con el nombre esperado
    const expectedFile = path.resolve(`downloads/reporte_${date1}_${date2}.pdf`);
    const exists = fs.existsSync(expectedFile);

    expect(exists).toBe(true);
  });
});

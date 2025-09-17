const qs = require("qs");
const cheerio = require("cheerio");
const httpClient = require("../helpers/httpClient");

async function login(user, pass) {
  const body = qs.stringify({
    userid3: user,
    password3: pass,
  });

  const response = await httpClient.post("/indice.php", body);
  const cookies = response.headers["set-cookie"];
  return cookies;
}

async function consultarReporte(date1, date2, cookies) {
  const body = qs.stringify({ date1, date2 });

  const response = await httpClient.post("/reporteexcel_radicados.php", body, {
    headers: { Cookie: cookies.join("; ") },
  });

  const $ = cheerio.load(response.data);
  const link = $("a[href*='bajar_reporteradicados.php']").attr("href");

  if (!link) throw new Error("No se encontró el link al reporte");

  return link;
}

async function descargarReporteBuffer(link, cookies) {
  const response = await httpClient.get(`/${link}`, {
    headers: { Cookie: cookies.join("; ") },
    responseType: "arraybuffer",
  });

  return response.data; // buffer
}

module.exports = { login, consultarReporte, descargarReporteBuffer };

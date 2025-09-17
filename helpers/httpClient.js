const axios = require("axios");

const httpClient = axios.create({
  baseURL: "https://auditorias.dygconsultores.com.co/cuentasmedicasdyg_2024",
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

module.exports = httpClient;

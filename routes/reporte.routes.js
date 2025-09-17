const express = require("express");
const router = express.Router();
const { generarReporte } = require("../controllers/reporte.controller");

router.get("/reporte", generarReporte);

module.exports = router;

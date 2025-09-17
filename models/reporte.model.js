// Aquí podrías definir un esquema de datos si luego lo guardas en BD
class Reporte {
  constructor({ usuario, fechaInicio, fechaFin, archivo }) {
    this.usuario = usuario;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.archivo = archivo; // path al PDF/Excel descargado
  }
}

module.exports = Reporte;

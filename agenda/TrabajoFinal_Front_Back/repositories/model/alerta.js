
const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
  mensaje: String,
  fecha: Date,
  // agrega los campos que necesites
});

const Alerta = mongoose.model('Alerta', alertaSchema);

module.exports = Alerta;

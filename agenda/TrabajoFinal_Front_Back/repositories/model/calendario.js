const mongoose = require('mongoose');

const calendarioSchema = new mongoose.Schema({
  dia: { type: Number, required: true },
  mes: { type: Number, required: true },
  horario: { type: String },
  actividad: { type: String }
});

// 👇 usamos "calendario" como nombre exacto de la colección
module.exports = mongoose.model('Calendario', calendarioSchema, 'calendario');

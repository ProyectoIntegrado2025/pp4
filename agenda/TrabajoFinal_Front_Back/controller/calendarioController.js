const Calendario = require('../repositories/model/calendario');

// Obtener
const readCalendario = async (req, res) => {
  try {
    const actividades = await Calendario.find();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener por mes
const readCalendarioMes = async (req, res) => {
  try {
    const { mes } = req.params;
    const actividades = await Calendario.find({ mes: parseInt(mes, 10) });
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear 
const createActividad = async (req, res) => {
  try {
    const { dia, horario, actividad } = req.body;
    const { mes } = req.params; 

    const nuevaActividad = new Calendario({
      dia,
      mes: parseInt(mes, 10),
      horario,
      actividad
    });

    await nuevaActividad.save();
    res.status(201).json(nuevaActividad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar
const updateActividad = async (req, res) => {
  try {
    const { mes, dia } = req.params;
    const { horario, actividad } = req.body;

    const updated = await Calendario.findOneAndUpdate(
      { mes: parseInt(mes, 10), dia: parseInt(dia, 10) },
      { horario, actividad },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar 
const deleteActividad = async (req, res) => {
  try {
    const { mes, dia } = req.params;

    const deleted = await Calendario.findOneAndDelete({
      mes: parseInt(mes, 10),
      dia: parseInt(dia, 10)
    });

    if (!deleted) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.json({ message: "Actividad eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  readCalendario,
  readCalendarioMes,
  createActividad,
  updateActividad,
  deleteActividad
};

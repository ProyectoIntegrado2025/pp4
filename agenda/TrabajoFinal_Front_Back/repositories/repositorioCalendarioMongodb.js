const Calendario = require('../repositories/model/calendario');

// ✅ Obtener todas las actividades
exports.getCalendariocompletorepository = async () => {
    try {
        return await Calendario.find();
    } catch (error) {
        throw new Error("Error en getCalendariocompletorepository: " + error.message);
    }
};

// ✅ Obtener actividades de un mes específico
exports.getCalendarioPorMesRepository = async (mes) => {
    try {
        return await Calendario.find({ mes: parseInt(mes) });
    } catch (error) {
        throw new Error("Error en getCalendarioPorMesRepository: " + error.message);
    }
};

// ✅ Crear nueva actividad
exports.createActividadRepository = async (actividadNueva) => {
    try {
        const nuevaActividad = new Calendario(actividadNueva);
        return await nuevaActividad.save();
    } catch (error) {
        throw new Error("Error en createActividadRepository: " + error.message);
    }
};

// ✅ Actualizar actividad por día y mes
exports.updateActividadRepository = async (dia, mes, actividadActualizada) => {
    try {
        return await Calendario.findOneAndUpdate(
            { dia: parseInt(dia), mes: parseInt(mes) },
            actividadActualizada,
            { new: true }
        );
    } catch (error) {
        throw new Error("Error en updateActividadRepository: " + error.message);
    }
};

// ✅ Eliminar actividad por día y mes
exports.deleteActividadRepository = async (dia, mes) => {
    try {
        return await Calendario.findOneAndDelete({ dia: parseInt(dia), mes: parseInt(mes) });
    } catch (error) {
        throw new Error("Error en deleteActividadRepository: " + error.message);
    }
};

// ✅ Obtener alertas (ejemplo: actividades de hoy)
exports.obtenerAlertasRepository = async () => {
    try {
        const hoy = new Date();
        const dia = hoy.getDate();
        const mes = hoy.getMonth() + 1;
        return await Calendario.find({ dia, mes });
    } catch (error) {
        throw new Error("Error en obtenerAlertasRepository: " + error.message);
    }
};

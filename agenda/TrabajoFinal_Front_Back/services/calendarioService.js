const repositorioCalendario = require('../repositories/repositorioCalendarioMongodb');

// ✅ Obtener todas las actividades
exports.getCalendariocompleto = async () => {
    try {
        console.log("SERVICE getCalendariocompleto");
        return await repositorioCalendario.getCalendariocompletorepository();
    } catch (error) {
        console.log("ERROR getCalendariocompleto");
        throw Error("error " + error);
    }
};

// ✅ Obtener actividades de un mes específico
exports.getCalendarioPorMes = async (mes) => {
    try {
        console.log(`SERVICE getCalendario mes ${mes}`);
        return await repositorioCalendario.getCalendarioPorMesRepository(mes);
    } catch (error) {
        console.log("ERROR getCalendarioPorMes");
        throw Error("error " + error);
    }
};

// ✅ Crear actividad en cualquier mes
exports.createActividad = async (actividadNueva) => {
    try {
        console.log(`SERVICE createActividad mes ${actividadNueva.mes}`);
        return await repositorioCalendario.createActividadRepository(actividadNueva);
    } catch (error) {
        console.log("ERROR createActividad");
        throw Error("error en service  " + error);
    }
};

// ✅ Actualizar actividad por día y mes
exports.updateActividad = async (dia, mes, actividadActualizada) => {
    try {
        console.log(`SERVICE updateActividad mes ${mes}, dia ${dia}`);
        return await repositorioCalendario.updateActividadRepository(dia, mes, actividadActualizada);
    } catch (error) {
        console.log("ERROR updateActividad");
        throw new Error("error en service  " + error);
    }
};

// ✅ Eliminar actividad por día y mes
exports.deleteActividadService = async (dia, mes) => {
    try {
        console.log(`SERVICE deleteActividad mes ${mes}, dia ${dia}`);
        return await repositorioCalendario.deleteActividadRepository(dia, mes);
    } catch (error) {
        console.log("Error en deleteActividadService - " + error);
        throw Error("Error en el service: " + error);
    }
};

// ✅ Obtener alertas
exports.obtenerAlertas = async () => {
    try {
        return await repositorioCalendario.obtenerAlertasRepository();
    } catch (error) {
        throw new Error(error.message);
    }
};

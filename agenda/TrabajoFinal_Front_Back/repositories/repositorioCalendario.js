const {Apicalendario} = require('../src/ApiProyecto')
const getconnectionDB = require('../database/conexion')



exports.getCalendariocompletorepository = async () => {
    const pool = await getconnectionDB()

    try {
        console.log("REPOSITORIO getCalendariocompletorepository ")
        const resulatdo = await pool.request().query("select * from Apicalendario")
        console.table(resulatdo.recordset)
        return resulatdo.recordset

    } catch (error) {
        console.log("error getCalendariocompletorepository" + error)
        
        throw Error("error getCalendariocompletorepository" + error)
    }
}

exports.getJulioCalendarioRepository = async () => {
    try {
        console.log("REPOSITORIO getjulioalendariocompletorepository ")

        return await JSON.stringify(Apicalendario.Julio)
    } catch (error) {
        console.log("error getjulioCalendariocompletorepository" + error)
        throw Error("error " + error)
    }
}

exports.getagostoCalendarioRepository = async () => {
    try {
        console.log("REPOSITORIO getagostoalendariocompletorepository ")
        return JSON.stringify(Apicalendario.Agosto)

    } catch (error) {
        console.log("error getagostoCalendariocompletorepository" + error)
        throw Error("error " + error)
    }
}

exports.createActividadAgostoRepository = async (actividadNueva) => {
    try {
        Apicalendario.Agosto.push(actividadNueva);
        return await Apicalendario.Agosto;
    } catch (error) {
        console.log("error createActividadAgostoRepository: " + error);
        throw Error("error al crear la actividad: " + error);
    }
};

exports.createActividadJulioRepository = async (actividadNueva) => {
    try {
        Apicalendario.Julio.push(actividadNueva);
        return await Apicalendario.Julio;
    } catch (error) {
        console.log("error createActividadjulioRepository: " + error);
        throw Error("error al crear la actividad: " + error);
    }
};

exports.updateActividadJulioRepository = async (id, actividadActualizada) => {
    try {
        const indice = await Apicalendario.Julio.findIndex(actividad => actividad.dia === id);

        if (indice >= 0) {
            const actividadAModificar = Apicalendario.Julio[indice];
            Object.assign(actividadAModificar, actividadActualizada);
            return Apicalendario.Julio;
        } else {
            return [];
        }
    } catch (error) {
        console.log("error updateActividadJulioRepository: " + error);
        throw Error("error al cambiar la actividad: " + error);
    }
}
//delete julio

exports.deleteActividadJulioRepository = async (id) => {
    try {
        console.log(`REPOSITORIO ${id}`)
        const indice = await Apicalendario.Julio.findIndex(actividad => actividad.dia === id)

        if (indice >= 0) {
            frontend.splice(indice, 1);
            return frontend
        } else {
            return []
        }
    } catch (error) {
        console.log("deleteFrontendLanguageRepository - " + error)
        throw Error("Error al intentar eliminar lenguaje: - " + error)
    }
}
exports.deleteActividadAgostoRepository = async (id) => {
    try {
        console.log(`REPOSITORIO :${id}`)
        const indice = await Apicalendario.Agosto.findIndex(actividad => actividad.dia === id)

        if (indice >= 0) {
            frontend.splice(indice, 1);
            return frontend
        } else {
            return []
        }
    } catch (error) {
        console.log("deleteFrontendLanguageRepository - " + error)
        throw Error("Error al intentar eliminar lenguaje: - " + error)
    }
}
exports.guardarAlertaRepository = async (datosAlerta) => {
    try {
        const alerta = new Alerta(datosAlerta);
        await alerta.save();
        console.log('Alerta guardada correctamente');
    } catch (error) {
        console.error('Error al guardar la alerta:', error);
        throw new Error('No se pudo guardar la alerta');
    }
};

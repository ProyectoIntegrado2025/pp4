
const express = require('express');
const routerCalendario = express.Router();

routerCalendario.use(express.json());

const CalendarioController = require('../controller/calendarioController');

// ✅ Obtener todas las actividades
routerCalendario.get('/', CalendarioController.readCalendario);

// ✅ Obtener actividades por mes (ej: /api/calendario/7 → julio)
routerCalendario.get('/:mes', CalendarioController.readCalendarioMes);

// ✅ Crear una actividad en un mes y día
routerCalendario.post('/:mes', CalendarioController.createActividad);

// ✅ Actualizar actividad por mes y día
routerCalendario.patch('/:mes/:dia', CalendarioController.updateActividad);

// ✅ Eliminar actividad por mes y día
routerCalendario.delete('/:mes/:dia', CalendarioController.deleteActividad);

module.exports = routerCalendario;


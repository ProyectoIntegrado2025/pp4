const express = require('express');
const cors = require('cors'); 
const { getMongoDBConnection } = require('./database/conexion'); // 👈 tu conexión

const app = express();

app.use(cors());
app.use(express.json()); // 👈 necesario para leer JSON en POST/PATCH

const HOSTNAME = '127.0.0.1';
const PORT = 3000;

// 🔌 Conectar a MongoDB
getMongoDBConnection();

const routerCalendario = require('./Routers/RouterCalendario');

// router principal
app.use('/api/calendario', routerCalendario);

// otros endpoints
app.get('/', function (req, res) {
    res.send('<h1>HOLA MUNDO </h1>')
});

app.get('/grupo', function (req, res) {
    res.send('<h1>HOLA grupo de trabajo final</h1>')
});

// catch-all route para rutas no encontradas
app.use((req, res) => {
    res.status(404).send("La ruta ingresada no existe");
});

// levantar servidor
app.listen(PORT, () => {
    console.log(`El servidor EXPRESS esta corriendo en http://localhost:${PORT}/`)
});

const mongoose = require('mongoose');
const { configDBMongoDB } = require('./config');

 const URI = `mongodb+srv://${configDBMongoDB.user}:${configDBMongoDB.password}@${configDBMongoDB.cluster}/${configDBMongoDB.database}?retryWrites=true&w=majority`;



const getMongoDBConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { getMongoDBConnection };




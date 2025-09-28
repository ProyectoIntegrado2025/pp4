const dotenv = require('dotenv');
dotenv.config();


const configDBMongoDB = {
    user: process.env.USER_DB_MONGO_DB,
    password: process.env.PASSWORD_DB_MONGO_DB,
    database: process.env.NAME_DB_MONGO_DB,
    cluster: process.env.MONGO_CLUSTER
    }


module.exports = { configDBMongoDB };

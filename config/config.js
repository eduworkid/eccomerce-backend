const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

module.exports = {
    rootpath : path.resolve(__dirname, '..'),
    secretKey : process.env.SECRET_KEY,
    servieName: process.env.SERVICE_NAME,
    dbHost : process.env.DB_HOST,
    dbPort : process.env.DB_PORT,
    dbUser : process.env.DB_USER,
    dbPass : process.env.DB_PAS,
    dbName : process.env.DB_NAME
}
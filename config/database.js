const mongoose = require('mongoose');
const { dbHost, dbPass, dbPort, dbUser, dbName } = require('./config');

const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; 

db.on('open', function () {
  console.log('Database connected');
});

db.on('error', function (err) {
  console.error('MongoDB connection error:', err);
});

module.exports = db;

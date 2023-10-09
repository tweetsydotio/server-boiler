const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL, {
    dbName: process.env.DB_NAME,
  });
  console.log('Database connected');
};

module.exports = connectDB;

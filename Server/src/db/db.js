const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,
      {
        dbName: process.env.MONGODB_DATABASE_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log('Database connected successfully');
  } catch (error) {
    console.error(`Unable to connect to Database - ${error.message}`);
  }
};

module.exports = db;
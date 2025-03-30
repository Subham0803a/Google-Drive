const mongoose = require('mongoose');
require('dotenv').config();

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log('Database connected successfully....');
  } catch (error) {
    console.error(`Unable to connect to Database - ${error.message}`);
  }
};

module.exports = db;
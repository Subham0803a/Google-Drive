const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports = () => {
  const usersSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Number,
      default: null,
    },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

  return mongoose.model('Users', usersSchema);
};


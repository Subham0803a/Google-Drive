const mongoose = require('mongoose');

module.exports = () => {
  const studentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    collage: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

  return mongoose.model('students', studentSchema);
};
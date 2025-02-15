const { Student } = require('../models/index');

const getAllStudents = async (limit, skip) => {
  try {
    const result = await Student.find()
      .lean()
      .limit(limit)
      .skip(skip)
      .sort({ name: 1 });
    
    return result;
  } catch (error) {
    throw new Error(`Error fetching students: ${error.message}`);
  }
};

const getStudentsCount = async () => {
  try {
    return await Student.countDocuments();
  } catch (error) {
    throw new Error(`Error getting students count: ${error.message}`);
  }
};

const createNewStudent = async (data) => {
  try {
    const result = await Student.create(data);
    return result;
  } catch (error) {
    throw new Error(`Error creating student: ${error.message}`);
  }
};

const findAndUpdate = async (id, data) => {
  try {
    const result = await Student.findByIdAndUpdate({ _id: id }, data, { new: true });
    return result;
  } catch (error) {
    throw new Error(`Error updating student: ${error.message}`);
  }
};

const deleteStudent = async (id) => {
  try {
    const result = await Student.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      const error = new Error('Student not found');
      error.statusCode = 404;
      throw error;
    }
    return result;
  } catch (error) {
    throw new Error(`Error deleting student: ${error.message}`);
  }
};

module.exports = {
  getStudentsCount,
  getAllStudents,
  createNewStudent,
  findAndUpdate,
  deleteStudent,
};
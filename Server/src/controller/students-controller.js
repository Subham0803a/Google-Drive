const {
  getStudentsCount,
  getAllStudents,
  createNewStudent,
  findAndUpdate,
  deleteStudent,
} = require('../managers/students-manager');

const getStudents = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;
    const parsedLimit = Number.isNaN(parseInt(limit)) ? 20 : parseInt(limit);
    const parsedSkip = Number.isNaN(parseInt(skip)) ? 0 : parseInt(skip);
    
    const totalCount = await getStudentsCount();
    const result = await getAllStudents(parsedLimit, parsedSkip);
    
    const response = result.map((item) => ({
      id: item._id,
      Name: item.name,
      College: item.collage,
      Branch: item.branch
    }));
    
    res.status(200).json({
      totalCount,
      data: response,
    });
    return;
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { name, collage, branch } = req.body;
    
    const payload = {
      name,
      collage,
      branch
    };
    
    const result = await createNewStudent(payload);
    const response = {
      id: result._id.toString(),
      name: result.name,
      college: result.collage,
      branch: result.branch
    };
    
    res.status(201).json(response);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, collage, branch } = req.body;
    
    const payload = {
      name,
      collage,
      branch
    };
    
    const result = await findAndUpdate(id, payload);
    if (!result) {
      const error = new Error('Student not found');
      error.statusCode = 400;
      throw error;
    }
    
    const response = {
      id: result._id.toString(),
      Name: result.name,
      College: result.collage,
      Branch: result.branch
    };
    
    res.status(202).json(response);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const deleteStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteStudent(id);
    
    if (result) {
      res.status(200).json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudentById,
};
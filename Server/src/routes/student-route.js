const express = require('express');
const router = express.Router();

const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudentById,
} = require('../controller/students-controller');

/**s
 * @description API to get students
 */
router.get('/', (req, res, next) => getStudents(req, res, next));

/**
 * @description API to create student
 */
router.post('/', (req, res, next) => createStudent(req, res, next));

/**
 * @description API to update student
 */
router.patch('/:id', (req, res, next) => updateStudent(req, res, next));

/**
 * @description API to delete student
 */
router.delete('/:id', (req, res, next) => deleteStudentById(req, res, next));

module.exports = router;
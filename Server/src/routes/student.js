const express = require('express');

const router = new express.Router();
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudentById,
} = require('../controller/students-controller');

/**s
 * @description API to get students
 */
router.get('/students', (req, res, next) => getStudents(req, res, next));

/**
 * @description API to create student
 */
router.post('/students', (req, res, next) => createStudent(req, res, next));

/**
 * @description API to update student
 */
router.patch('/students/:id', (req, res, next) => updateStudent(req, res, next));

/**
 * @description API to delete student
 */
router.delete('/students/:id', (req, res, next) => deleteStudentById(req, res, next));

module.exports = router;
const express = require('express');
const studentRoutes = require('./student-route');
const authRoutes = require('./auth-route');

const router = express.Router();

/**
 * api/student
 */
router.use('/students', studentRoutes);
/**
 * api/student
 */
router.use('/auth', authRoutes);

module.exports = router;
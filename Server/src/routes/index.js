const express = require('express');
const studentRoute = require('./student-route');
const authRoute = require('./auth-route')

const router = express.Router();

/**
 * api/student
 */
router.use('/students', studentRoute);

/**
 * api/auth
 */
router.use('/auth', authRoute);

module.exports = router;
const express = require('express');
const authMiddleware = require('../utils/middleware/auth');
const router = express.Router();

const {
  register,
  login,
  verifyOTP,
  logout,
} = require('../controller/auth-controller');

/**s
 * @description API for Registration
 */
router.post('/register', register);

/**
 * @description API for login
 */
router.post('/login', login);

/**
 * @description API for OTP verification
 */
router.post('/verify-otp', verifyOTP);

/**
 * @description API for logout
 */
router.post('/logout', logout);

module.exports = router;
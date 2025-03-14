const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authMiddleware = require('../utils/middleware/auth');
const { register, login, verifyOTP, refresh, logout } = require('../controller/auth-controller');

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required'
    }),
  gmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});


/**
 * Register a new user
 * @param {Object} req.body - User registration data
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.gmail - The Gmail address of the user
 * @param {string} req.body.password - The password of the user
 * @returns {Object} - Success message with created user details
 * @throws {Object} - 400 if validation fails or user already exists, 500 for server errors
 */
router.post('/register', registerSchema, authMiddleware, register);

/**
 * Initiate user login and send OTP
 * @param {Object} req.body - User login credentials
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.password - The password of the user
 * @returns {Object} - Message indicating OTP has been sent
 * @throws {Object} - 401 if credentials are invalid, 500 for server errors
 */
router.post('/login', login);

/**
 * Verify OTP and complete login
 * @param {Object} req.body - OTP verification data
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.otp - The OTP received by the user
 * @returns {Object} - Login success with access and refresh tokens
 * @throws {Object} - 401 if OTP is invalid or expired, 500 for server errors
 */
router.post('/verify-otp', verifyOTP);

/**
 * Refresh access token using refresh token
 * @param {Object} req.body - Refresh token data (or extracted from cookies)
 * @returns {Object} - New access token
 * @throws {Object} - 403 if refresh token is invalid or expired, 500 for server errors
 */
router.post('/refresh', refresh);

/**
 * Log out the user by invalidating tokens
 * @param {Object} req.user - Authenticated user data (provided by authMiddleware)
 * @returns {Object} - Logout success message
 * @throws {Object} - 401 if user is not authenticated, 500 for server errors
 */
router.post('/logout', authMiddleware, logout);

module.exports = router;
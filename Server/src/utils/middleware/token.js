const jwt = require('jsonwebtoken');

/**
 * Generate an access token for authenticated sessions
 * @param {Object} user - User object with _id and username
 * @returns {String} - Signed JWT access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

/**
 * Generate a refresh token for prolonged authentication
 * @param {Object} user - User object with _id
 * @returns {String} - Signed JWT refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

/**
 * Verify a JWT token's validity
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key for verification
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error; 
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
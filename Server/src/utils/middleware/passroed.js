const bcrypt = require('bcryptjs');

/**
 * Hash a plaintext password for secure storage
 * @param {String} password - Plaintext password
 * @returns {String} - Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plaintext password with its hash
 * @param {String} password - Plaintext password
 * @param {String} hashedPassword - Hashed password from DB
 * @returns {Boolean} - True if they match
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
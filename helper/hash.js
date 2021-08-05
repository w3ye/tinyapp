const bcrypt = require('bcrypt');

/**
 * Hash password using bcrypt
 * @param {string} password value to be encrypted
 */
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares the hashed password to the unhashed password
 * @param {string} hashedPassword
 * @param {string} password
 * @return {boolean} true -> match
 */
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};

const bcrypt = require('bcrypt');

/**
 * Hash password using bcrypt
 * @param {String} password value to be encrypted
 */
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares the hashed password to the unhashed password
 * true -> match
 * @param {String} hashedPassword
 * @param {String} password
 */
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};

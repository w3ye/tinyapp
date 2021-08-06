/**
 * Using email as to find the user in the database
 * @param {string} email
 * @param {object} database - database of users
 * @returns {object} user object
 */
const getUserByEmail = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) return database[key];
  }
  return undefined;
};

/**
 * Returns the urls that the users owns
 * @param {string} id userID
 * @param {object} database urlDatabase
 * @return {object} url object, null if the object is empty
 */
const urlsForUser = (id, database) => {
  let ret = {};
  for (let key in database) {
    if (database[key].userID === id) {
      ret[key] = database[key];
    }
  }
  return (Object.entries(ret).length !== 0) ? ret : null;
};

/**
 * Generate a random 6 character alphanumeric
 * @returns {string} alphanumeric
 */
const generateRandomString = () => {
  let ret = "";

  for (let i = 0; i < 6; i++) {
    const randomPick = Math.floor(Math.random() * 3);
    switch (randomPick) {
    // Uppercase
    case 0:
      // Uppercase ascii 65 - 90 inclusive
      ret += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
      break;
    case 1:
      // Lowercase ascii 97 - 122 inclusive
      ret += String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1)) + 97);
      break;
    case 2:
      // 0 - 9
      ret += Math.floor(Math.random() * 10);
      break;
    }
  }
  return ret;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser
};

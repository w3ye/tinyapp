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
  return null;
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

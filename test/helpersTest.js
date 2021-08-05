const { assert } = require('chai');
const { getUserByEmail } = require('../helper/helper');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('Should return a user object with the email', () => {
    const user = getUserByEmail('user@example.com', testUsers);
    assert.deepEqual(user, testUsers['userRandomID']);
  });
  it('Should return null if no user have this email', () => {
    const user = getUserByEmail('user3@example.com', testUsers);
    assert.deepEqual(user, null);
  });
});

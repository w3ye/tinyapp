const { assert } = require('chai');
const { getUserByEmail, urlsForUser } = require('../helper/helper');

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

const urlDatabase = {
  b6UTxQy: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  '4CXZ8j': {
    longURL: 'http://www.duck.com',
    userID: 'xFq0Sv'
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "hello@hi.com",
    password: '1234'
  },
  xFq0Sv: {
    id: 'xFq0Sv',
    email: 'cool@hi.com',
    password: '1234'
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

describe('urlsForUser', () => {
  it('Should return an url object that the user own', () => {
    const urls = urlsForUser('aJ48lW', urlDatabase);
    const expected = {
      b6UTxQy: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
      i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' }
    };
    assert.deepEqual(urls, expected);
  });
  it('Should return null if the database does not have the user', () => {
    const urls = urlsForUser('1234', urlDatabase);
    assert.deepEqual(urls, null);
  });
});

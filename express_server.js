const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const { hashPassword, comparePassword } = require('./helper/hash');
const { getUserByEmail, generateRandomString } = require('./helper/helper');
const app = express();
const PORT = 8080;

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

// Middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.get('/', (req, res) => {
  res.send('Hello');
});

// Generate Initial /url page
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session['user_id']] ? users[req.session['user_id']] : undefined
  };
  res.render('urls_index', templateVars);
});

// Generating a urlKey that redirects to /urls/:shortURL
app.post('/urls', (req, res) => {
  const key = generateRandomString();
  const redirectedURL = `/urls/${key}`;
  if (req.session['user_id']) {
    urlDatabase[key] = {
      longURL: req.body.longURL,
      userID: req.session['user_id']
    };
    res.redirect(redirectedURL);
  } else {
    res.sendStatus(400);
    res.send('You are not logged in');
  }
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']] ? users[req.session['user_id']] : undefined
  };

  if (req.session['user_id'] !== undefined) return res.render('urls_new', templateVars);
  res.redirect('/login');
});

// Show the information of LongURL and ShortURL in page
app.get('/urls/:shortURL', (req, res) => {
  // if the user is not loged in jump to the login
  if (req.session['user_id'] === undefined) {
    res.redirect('/login');
  }
  if (urlDatabase[req.params.shortURL].userID === req.session['user_id']) {
    const templateVars = {
      shortURL: req.params.shortURL,
      url: urlDatabase,
      user: users[req.session['user_id']]
    };
    res.render('urls_show', templateVars);
  } else res.status(403).send('Current user does not have ownership of this shortened url');
});

// When shortURL is clicked in url_show template. Redirect to the longURL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
  res.status(400);
  res.send('Invalid short url');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  // if the url belongs the the user
  if (urlDatabase[req.params.shortURL].userID === req.session['user_id']) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else res.status(403).send(' Current user doesn\'t have ownership');
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[req.params.shortURL].userID === req.session['user_id']) {
    urlDatabase[shortURL].longURL = req.body.newLongURL;
    res.redirect(`/urls/${shortURL}`);
  } else res.status(403).send(' Current user doesn\'t have ownership');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']] ? users[req.session['user_id']] : undefined
  };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const user = getUserByEmail(email, users);

  // if user doesn't exist
  if (user === undefined) {
    res.status(403).send('Username or password Incorrect'); 	// if the user not found (403)
  } else if (comparePassword(req.body.password, user.password)) {
    req.session['user_id'] = user.id;
    res.redirect('/urls');
  } else res.status(403).send('Username or password Incorrect');	// if the user is found but password incorrect (403)
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']] ? users[req.session['user_id']] : undefined
  };
  res.render('user_register', templateVars);
});

// returns false when email/password is empty or the email exists in users
const validateRegisterUser = (email, password) => {
  if (email === '' || password === '') return false;
  for (let key in users) {
    if (getUserByEmail(email,users)) return false;
  }
  return true;
};

app.post('/register', (req, res) => {
  const userId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  // if the username exists
  if (!validateRegisterUser(email, password)) {
    req.session = null;
    return res.status(400).send('Email used');
  }
  users[userId] = {
    id: userId,
    email: email,
    password: hashPassword(password)
  };
  req.session['user_id'] = userId;
  res.redirect('/urls');
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello World!'};
  res.render("hello_world", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

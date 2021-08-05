const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const urlDatabase = {
  b6UTxQ: {
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

// generate 6 alphanumeric values
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

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello');
});

// Generate Initial /url page
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']] ? users[req.cookies['user_id']] : undefined
  };
  res.render('urls_index', templateVars);
});

// Generating a urlKey that redirects to /urls/:shortURL
app.post('/urls', (req, res) => {
  const key = generateRandomString();
  const redirectedURL = `/urls/${key}`;
  console.log(req.body.longURL);
  if (req.cookies['user_id']) {
    urlDatabase[key] = {
      longURL: req.body.longURL,
      userID: req.cookies['user_id']
    };
    res.redirect(redirectedURL);
  } else {
    res.sendStatus(400);
    res.send('You are not logged in');
  }
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']] ? users[req.cookies['user_id']] : undefined
  };

  if (req.cookies['user_id'] !== undefined) res.render('urls_new', templateVars);
  res.redirect('/login');
});

// Show the information of LongURL and ShortURL in page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['user_id']] ? users[req.cookies['user_id']] : undefined
  };
  
  res.render('urls_show', templateVars);
});

// When shortURL is clicked in url_show template. Redirect to the longURL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
  res.status(400).send('Invalid short url');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.newLongURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']] ? users[req.cookies['user_id']] : undefined
  };
  res.render('login', templateVars);
});

// return user object by looking email
const getUser = (email) => {
  for (let key in users) {
    if (users[key].email === email) return users[key];
  }
  return undefined;
};

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = getUser(email);

  if (user === undefined) {
    res.status(403).send('Username or password Incorrect'); 	// if the user not found (403)
  }
  if (password === user.password) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  }
  res.status(403).send('Username or password Incorrect');	// if the user is found but password incorrect (403)
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']] ? users[req.cookies['user_id']] : undefined
  };
  res.render('user_register', templateVars);
});

// returns false when email/password is empty or the email exists in users
const validateRegisterUser = (email, password) => {
  if (email === '' || password === '') return false;
  for (let key in users) {
    if (getUser(email)) return false;
  }
  return true;
};

app.post('/register', (req, res) => {
  const userId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!validateRegisterUser(email, password)) {
    res.clearCookie('user_id');
    return res.status(400).send('Email used');
  }
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', userId);
  res.redirect('/urls');
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello World!'};
  res.render("hello_world", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
    username: req.cookies['username'] ? req.cookies['username'] : undefined
  };
  res.render('urls_index', templateVars);
});

// Generating a urlKey that redirects to /urls/:shortURL
app.post('/urls', (req, res) => {
  const key = generateRandomString();
  const redirectedURL = `/urls/${key}`;
  urlDatabase[key] = req.body.longURL;
  res.redirect(redirectedURL);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies['username'] ? req.cookies['username'] : undefined
  };
  res.render('urls_new', templateVars);
});

// Show the information of LongURL and ShortURL in page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username'] ? req.cookies['username'] : undefined
  };
  res.render('urls_show', templateVars);
});

// When shortURL is clicked in url_show template. Redirect to the longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.newLongURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const templateVars = {
    username: req.cookies['username'] ? req.cookies['username'] : undefined
  };
  res.render('user_register', templateVars);
});

app.post('/register', (req, res) => {
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', userId);
  res.redirect('/register');
});

app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello World!'};
  res.render("hello_world", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

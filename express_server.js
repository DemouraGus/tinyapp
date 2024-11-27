const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8080;

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

app.set('view engine', 'ejs');
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  exampleUserID: {
    userID: 'exampleUserID',
    email: 'user@example.com',
    password: 'userExample'
  }
};

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { urls: urlDatabase, user: user };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const id = generateRandomString();
  const longUrl = req.body.longURL;
  urlDatabase[id] = longUrl;
  res.redirect(`/urls/${id}`);
})

app.get('/urls/new', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { user: user }
  res.render("urls_new", templateVars);
});

app.get('/urls/:id', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: user }; // Not sure about the longURL value here
  res.render('urls_show', templateVars);
});

app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/u/:id', (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = users[userID];
  const templateVars = { user: user }
  res.render('register', templateVars)
});

app.post('/register', (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  const newUser = {
    userID: userID,
    email: email,
    password: password
  }

  users[userID] = newUser;
  res.cookie('user_id', userID);

  res.redirect('urls');
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

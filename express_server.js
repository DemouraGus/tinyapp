const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const port = 8080;
const bcrypt = require('bcryptjs');
const { generateRandomString, userLookup, urlsForUser } = require('./helpers'); // imports helper functions
const { urlDatabase, users } = require('./data/data_objects'); // imports data objects



app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: ['dkjlkfnvlkjlj'],
}));


app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  let errorMessage = null;

  if (!user) {
    errorMessage = "You must be logged in to use this feature";
  }

  // Line added to check if error message is shown on /urls when user is not logged in
  // Used this syntax to make it concise and pass the information to the ejs file
  const urls = user ? urlsForUser(user.id, urlDatabase) : {};
  
  const templateVars = { urls, user, errorMessage };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  if (!user) {
    return res.status(403).send('Must be logged in to shorten URLs');
  }

  const id = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[id] = { longURL: longURL, userID: userID};
  res.redirect(`/urls/${id}`);
});

app.get('/urls/new', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  if (!user) {
    return res.redirect('/login');
  }

  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get('/urls/:id', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  if (!user) {
    return res.status(403).send('Must be logged in to use this feature');
  }

  if (userID !== urlDatabase[req.params.id].userID) {
    return res.status(403).send('Requested short URL belongs to another user');
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user }; // Not sure about the longURL value here
  res.render('urls_show', templateVars);
});

app.post('/urls/:id', (req, res) => {
  const userID = req.session.userID;

  if (urlDatabase[req.params.id].userID !== userID) {
    return res.status(403).send('Requested short URL belongs to another user');
  }

  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  const userID = req.session.userID;

  if (urlDatabase[req.params.id].userID !== userID) {
    return res.status(403).send('Requested short URL belongs to another user');
  }

  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null; // changed from clearing just the userID information to clear the whole cookie as advised by the first evaluation
  res.redirect('/login');
});

app.get('/u/:id', (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;

  if (!urlDatabase[id]) {
    return res.status(403).send('Shortened URL does not exist');
  }

  res.redirect(longURL);
});

app.get('/login', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  if (user) {
    return res.redirect('/urls');
  }

  const templateVars = { user: user };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = userLookup(email, users);

  if (!user) {
    return res.status(403).send('Email cannot be found');
  }

  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(403).send('Wrong password');
  }

  req.session.userID = user.id;
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const userID = req.session.userID;
  const user = users[userID];

  if (user) {
    return res.redirect('/urls');
  }

  const templateVars = { user: user };
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
   
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    return res.status(400).send('Bad Request: email or password cannot be empty');
  }
  
  if (userLookup(email, users)) {
    return res.status(400).send('Bad Request: email already registered');
  }
  const id = generateRandomString();
  
  users[id] = { id, email, hashedPassword };

  req.session.userID = id;
  res.redirect('urls');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

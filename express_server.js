const express = require('express');
const app = express();
const port = 8080;

const urlDatavase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.get('/', (request, response) => {
  response.send('Hello!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

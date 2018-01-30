const express = require('express');
const app = express();
const opn = require('opn');

app.use(express.static('.'))

app.listen('3000', () => {
  console.log('Server Listening on port 3000');
  console.log('Opening server in Chrome');
  opn("http://localhost:3000/index.html", {app: 'google chrome'});
});

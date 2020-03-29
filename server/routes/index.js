const express = require('express');
const app = express();


app.use(require('./cliente'));
app.use(require('./admin'));
app.use(require('./general'));


module.exports = app;
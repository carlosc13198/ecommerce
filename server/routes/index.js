const express = require('express');
const app = express();


app.use(require('./cliente'));


module.exports = app;
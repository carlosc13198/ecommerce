const express = require('express');

const UserController = require('../controllers/user');
const ProductController = require('../controllers/product');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.post('/cliente', UserController.register)

app.post('/venta', verificaToken, ProductController.sell)

app.put('/cliente/:id', verificaToken, UserController.modifyInfo)

app.post('/usuario/login', UserController.login)

app.post('/cliente/cambio', verificaToken, UserController.passwordChange)



module.exports = app;
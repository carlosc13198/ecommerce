const express = require('express');
const { verificaAdmin } = require('../middlewares/autenticacion');
const app = express();
const UserController = require('../controllers/user');
const ProductController = require('../controllers/product');
app.post('/product', verificaAdmin, ProductController.register)
app.put('/producto/modificar', verificaAdmin, ProductController.modifyProduct)
app.get('/ventas', verificaAdmin, ProductController.showSells)
app.get('/clientes', verificaAdmin, UserController.showUsers)

module.exports = app;
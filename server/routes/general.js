const express = require('express');
const Producto = require('../models/product');
const Transaction = require('../models/transaction');
// const Usuario = require('../models/user');
const _ = require('underscore');
const app = express();
const ProductController = require('../controllers/product');

app.post('/productofindnombre', ProductController.findProductName)
app.post('/productofindcodigo', ProductController.findProductCod)

app.get('/productofinddesc', ProductController.findProductDiscount)
app.get('/productosUltimos', ProductController.findLastProducts)


app.get('/prodcutosmasvendidos', ProductController.findMostSell)


module.exports = app;
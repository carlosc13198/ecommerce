const express = require('express');
const Producto = require('../models/producto');
const Transaction = require('../models/transaction');
const Usuario = require('../models/usuario');
const _ = require('underscore');
const app = express();

app.post('/productofindnombre', async function(req, res) {
    let nombre = req.body.nombre;
    //console.log(codigo);
    try {
        const producto = await Producto.find({ nombre: nombre });
        //console.log(producto);
        res.json({
            ok: true,
            producto,
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            err
        });
    }
})
app.post('/productofindcodigo', async function(req, res) {
    let codigo = req.body.codigo;
    //console.log(codigo);

    try {
        const producto = await Producto.findOne({ code: codigo });
        //console.log(producto);
        res.json({
            ok: true,
            producto,
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            err
        });
    }

})

app.get('/productofinddesc', async function(req, res) {
    // let codigo = req.body.codigo;
    //console.log(codigo);

    try {
        const producto = await Producto.find({ descuento: { $gt: 0 } });
        console.log(producto);
        res.json({
            ok: true,
            producto,
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            err
        });
    }

})
app.get('/productosUltimos', async function(req, res) {
    try {
        const producto = await Producto.find().sort({ createdAt: -1 });

        //const producto = await Producto.find({ descuento: { $gt: 0 } });
        //console.log(producto);
        res.json({
            ok: true,
            producto,
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            error
        });
    }

})


app.get('/prodcutosmasvendidos', async function(req, res) {
    try {

        // const producto = (await Transaction.aggregate([{
        //         $group: {
        //             _id: $product,
        //             count: { $sum: 1 }
        //         }
        //     },
        //     {
        //         $sort: { "_id": 1 }
        //     }
        // ]));
        // res.json({
        //     ok: true,
        //     producto,
        // })

        const producto = await Transaction.aggregate([{ "$group": { _id: { "$toStirng": "$product" }, count: { $sum: 1 } } }])
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            error
        });
    }

})


module.exports = app;
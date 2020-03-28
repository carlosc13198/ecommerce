const express = require('express');
const Producto = require('../models/producto');
const Transaction = require('../models/transaction');
const _ = require('underscore');
const app = express();
app.post('/producto', async function(req, res) {
    let body = req.body;
    try {
        //const t = await Transaction.findById(id).populate('user','product');
        let producto = await new Producto({
            nombre: body.nombre,
            // descuento: parseInt(body.desc),
            precioUni: parseInt(body.prec)
        });

        await producto.save();
        res.json({
            ok: true,
            producto
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            err: {
                message: 'Error del sistema'
            }
        });
    }

})
app.put('/producto/modificar', async function(req, res) {
    let body = _.pick(req.body, ['nombre', 'precio', 'descuento']);
    let id = req.body.id;
    try {
        const prod = await Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        res.json({
            ok: true,
            producto: prod
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            err: error
        })
    }

})
app.get('/ventas', async function(req, res) {
    // let desde = req.query.desde || 0;
    // desde = Number(desde);
    // let limite = req.query.limite || 5;
    // limite = Number(limite);
    try {

        // const transactions = await Transaction.find({}, ' id user product amount discount');
        const transactions = await Transaction.find({});
        const conteo = await Transaction.count({});
        res.json({
            ok: true,
            transactions,
            cuantos: conteo
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            err
        });
    }

})
app.get('/clientes', async function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    try {

        const clientes = await Usuario.find({ estado: true }, ' id nombre apellido correo telefono edad')
            .skip(desde)
            .limit(limite)
        const conteo = await Usuario.count({ estado: true })
        res.json({
            ok: true,
            clientes,
            cuantos: conteo
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            err
        });
    }

})

module.exports = app;
const express = require('express');
const Producto = require('../models/producto');
const app = express();
app.post('/producto', async function(req, res) {
    let body = req.body;
    try {
        //const t = await Transaction.findById(id).populate('user','product');
        let producto = await new Producto({
            nombre: body.nombre,
            descuento: parseInt(body.desc),
            precioUni: parseInt(body.prec)
        });

        await producto.save().then(product => console.log('El producto' + product.nombre + ' ha sido agregado.'))
            .catch(err => handleError(err))
    } catch (error) {
        res.status(500).json({
            ok: false,
            err: {
                message: 'Error del sistema'
            }
        });
    }

})

module.exports = app;
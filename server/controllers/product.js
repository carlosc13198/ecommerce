const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/transaction');
const Producto = require('../models/product');
const User = require('../models/user');


async function sell(req, res) {
    let body = req.body;
    try {

        const user = await User.findById(req.id);
        if (!user) return res.status(404).json({
            ok: false,
            err: {
                message: 'Id de usuario no existe'
            }
        })

        const producto = await Producto.findById(body.id_producto);
        if (!producto) return res.status(404).json({
            ok: false,
            err: {
                message: 'Id de producto no existe'
            }
        })
        let a = await Math.round(producto.precioUni - producto.descuento);
        console.log(a);
        let transact = new Transaction({
            user: user._id,
            product: producto._id,
            amount: await Math.round((producto.precioUni - producto.descuento) * 100),
            dicount: producto.descuento

        });
        await transact.save();
        res.json({
            ok: true,
            transact
        })
    } catch (error) {
        console.log(error);
    }
}
async function register(req, res) {
    let body = req.body;
    try {
        //const t = await Transaction.findById(id).populate('user','product'); //Esta linea no sirve probablemente el modelo de transactions esta mal
        let producto = await new Producto({
            nombre: body.nombre,
            descuento: Number(body.desc),
            precioUni: Number(body.prec)
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

}
async function modifyProduct(req, res) {
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

}
async function showSells(req, res) {
    try {
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

}
async function findProductName(req, res) {
    let nombre = req.body.nombre;
    try {
        const producto = await Producto.find({ nombre: nombre });
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
}
async function findProductCod(req, res) {
    let codigo = req.body.codigo;
    try {
        const producto = await Producto.findOne({ code: codigo });
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
}
async function findProductDiscount(req, res) {
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
}
async function findLastProducts(req, res) {
    try {
        const producto = await Producto.find().sort({ createdAt: -1 });
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

}
async function findMostSell(req, res) {
    try {
        //QUIZE INTENTAR CON ESTO Y TAMPOCO FUNCIONA
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
        //LO QUE QUIERO HACER ES AGRUPARLOS Y CONTARLOS POR SU CODIGO DE PRODUCTO DE ESTA MANERA PUEDO HALLAR EL QUE MAS SE HA VENDIDO
        //EL PROBLEMA ES QUE AL USAR LA SIGUIENTE LINEA ME BOTA NULL YA QUE EL CAMPO PRODUCT EN EL MODELO TRANSACTION ES OBJECTID() NO SE SI ESE SEA EL PROBLEMA 
        //QUIZA LO ESTOY LLAMANDO MAL PERO NO SE COMO OBTENERLO 
        const producto = await Transaction.aggregate([{ "$group": { _id: { "$toStirng": "$product" }, count: { $sum: 1 } } }])
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            error
        });
    }

}
module.exports = {
    sell,
    register,
    modifyProduct,
    showSells,
    findProductCod,
    findProductDiscount,
    findProductName,
    findLastProducts,
    findMostSell
};
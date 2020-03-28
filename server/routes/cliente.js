const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/transaction');
const Producto = require('../models/producto');


const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.post('/cliente', async function(req, res) {
    let body = req.body;
    try {
        //const t= await Transaction.findById(id).populate('user','product');
        if (!(body.password1 === body.password2)) return throwError;
        let usuario = await new Usuario({
            nombre: body.nombre,
            apellido: body.apellido,
            correo: body.correo,
            telefono: body.telefono,
            password: body.password1,
            edad: body.edad
        });
        await usuario.save();
        res.json({
            ok: true,
            usuario
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            err: {
                message: 'Contraseñas no coinciden'
            }
        });
    }

})

app.post('/venta', async function(req, res) {
    let body = req.body;
    try {

        const user = await Usuario.findById(body.id_cliente);
        //console.log(user);
        if (!user) return res.status(404).json({
            ok: false,
            err: {
                message: 'Id de usuario no existe'
            }
        })

        const producto = await Producto.findById(body.id_producto);
        //console.log(producto);
        if (!producto) return res.status(404).json({
                ok: false,
                err: {
                    message: 'Id de producto no existe'
                }
            })
            //const t= await Transaction.findById(id).populate('user','product');
        let a = await Math.round(producto.precioUni - producto.descuento);
        console.log(a);
        let transact = new Transaction({
            user: user._id,
            product: producto._id,
            amount: await Math.round((producto.precioUni - producto.descuento) * 100),
            dicount: producto.descuento

        });
        //console.log(transact);
        await transact.save();
        res.json({
            ok: true,
            transact
        })


    } catch (error) {
        console.log(error);
    }

})

app.put('/cliente/:id', verificaToken, async function(req, res) {
    let id = req.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'telefono', 'edad']);

    try {
        const user = await Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        res.json({
            ok: true,
            usuario: user
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            err: error
        })
    }

})

app.post('/usuario/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ correo: body.correo }, async(err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario* o contraseña incorrectos'
                }
            });
        }
        console.log(usuarioDB);

        const match = await usuarioDB.compare(body.password)
        if (!match) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña* incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
})

app.post('/cliente/cambio', verificaToken, async(req, res) => {
    let id = req.id;
    let body = _.pick(req.body, ['passwordact', 'password1', 'password2']);
    try {

        const user = await Usuario.findById(id);
        const match = await user.compare(body.passwordact);

        if (!match) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'

                }
            });
        }

        if (!(body.password1 === body.password2)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseñas nuevas no coinciden'
                }
            });
        }

        if (!user) return res.status(404).json({
            ok: false,
            err: {
                message: 'Id de usuario no existe'
            }
        })
        console.log('antes de password1');
        user.password = body.password1;
        await user.save();
        res.json({
            ok: true,
            user
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            err: error
        });
    }
})



module.exports = app;
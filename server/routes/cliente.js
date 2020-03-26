const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.post('/cliente', function(req, res) {
    let body = req.body;
    if (!(body.password1 === body.password2)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Contraseñas no coinciden'
            }
        });
    }

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        telefono: body.telefono,
        password: bcrypt.hashSync(body.password1, 10),
        edad: body.edad
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})
app.get('/cliente', async function(req, res) {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        Usuario.find({ estado: true }, ' id nombre apellido correo telefono edad')
            .skip(desde)
            .limit(limite)
            .then(

                Usuario.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        clientes,
                        cuantos: conteo
                    })
                })
            )


    } catch (error) {
        res.status(400).json({
            ok: false,
            err
        });
    }

    //         .exec((err, clientes) => {
    //             if (err) {
    //                 res.status(400).json({
    //                     ok: false,
    //                     err
    //                 });
    //             }

    //             Usuario.count({ estado: true }, (err, conteo) => {
    //                 res.json({
    //                     ok: true,
    //                     clientes,
    //                     cuantos: conteo
    //                 })
    //             })

    //         })
})
app.put('/cliente/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'telefono', 'edad']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.post('/usuario/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {
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

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
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




    // if (!bcrypt.compareSync(body.passwordact, req.usuario.password)) {
    //     return res.status(400).json({
    //         ok: false,
    //         err: {
    //             message: 'Usuario o contraseña* incorrectos'
    //         }
    //     });
    // }
    if (!(body.password1 === body.password2)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Contraseñas nuevas no coinciden'
            }
        });
    }

    // let actualizar = {
    //     password: bcrypt.hashSync(body.password1, 10),
    //     nombre: body.nombre
    // };


    Usuario.findByIdAndUpdate(id, { password: body.password1 }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})



module.exports = app;
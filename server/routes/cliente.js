const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.post('/cliente', async function(req, res) {
    let body = req.body;
    try {
        if (!(body.password1 === body.password2)) return throwError;
        let usuario = await new Usuario({
            nombre: body.nombre,
            apellido: body.apellido,
            correo: body.correo,
            telefono: body.telefono,
            password: body.password1,
            edad: body.edad
        });
        await usuario.save().then((usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }).catch(error);
    } catch (error) {
        res.status(500).json({
            ok: false,
            err: {
                message: 'Contraseñas no coinciden'
            }
        });
    }





})
app.get('/cliente', async function(req, res) {
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
        await user.save().then((usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            err: error
        });
    }
})



module.exports = app;
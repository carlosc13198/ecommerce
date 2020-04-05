const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/transaction');
const Producto = require('../models/product');
const User = require('../models/user');

async function register(req, res) {
    let body = req.body;
    try {
        //const t= await Transaction.findById(id).populate('user','product');
        if (!(body.password1 === body.password2)) return throwError;
        let user = await new User({
            nombre: body.nombre,
            apellido: body.apellido,
            correo: body.correo,
            telefono: body.telefono,
            password: body.password1,
            edad: body.edad
        });
        await user.save();
        res.json({
            ok: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            err: {
                message: 'Contraseñas no coinciden'
            }
        });
    }

}

async function modifyInfo(req, res) {
    let id = req.id;
    let body = _.pick(req.body, ['nombre', 'apellido', 'correo', 'telefono', 'edad']);

    try {
        const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        res.json({
            ok: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            err: error
        })
    }

}

async function login(req, res) {
    let body = req.body;
    await User.findOne({ correo: body.correo }, async(err, usuarioDB) => {
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
            user: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({
            ok: true,
            user: usuarioDB,
            token
        })
    })
}
async function passwordChange(req, res) {
    let id = req.id;
    let body = _.pick(req.body, ['passwordact', 'password1', 'password2']);
    try {

        const user = await User.findById(id);
        if (!user) return res.status(404).json({
            ok: false,
            err: {
                message: 'Id de usuario no existe'
            }
        })
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
}
async function showUsers(req, res) {
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

}
module.exports = {
    register,
    passwordChange,
    modifyInfo,
    login,
    showUsers
};
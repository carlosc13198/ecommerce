const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');
// ==================
// VERIFICAR TOKEN 
// ======================

let verificaToken = async(req, res, next) => {
    let token = req.get('token'); //Authorization 

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        decoded = jwt.decode(token);
        console.log('me quedo aqui we');
        req.id = decoded.usuario._id;
        next();
    });


};
let verificaAdmin = async(req, res, next) => {
    let token = req.get('token'); //Authorization 

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        decoded = jwt.decode(token);
        console.log(decoded);
        if (decoded.usuario.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'No estas autorizado para usar esta funcion'
                }
            })
        }
        console.log('me quedo aqui we');
        req.id = decoded.user._id;
        req.role = decoded.user.role;
        next();
    });


};


module.exports = {
    verificaToken,
    verificaAdmin
}
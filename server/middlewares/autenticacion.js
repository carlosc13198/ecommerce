const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
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
        // req.role = decoded.usuario.role;
        next();
    });


};


module.exports = {
    verificaToken
}
const jwt = require('jsonwebtoken');

// ==================
// VERIFICAR TOKEN 
// ======================

let verificaToken = (req, res, next) => {
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
        req.usuario = decoded.usuario;

        next();
    });


};


module.exports = {
    verificaToken
}
const mongoose = require(`mongoose`);
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} NO ES UN ROL VALIDO'
};

let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    correo: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    telefono: {
        type: String,
        required: [true, 'El telefono es requerido']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    edad: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    }
});
const compareHash = function(posiblePassword, hashPassword) {
    return new Promise((res, rej) => {
        bcrypt.compare(posiblePassword, hashPassword, (err, match) => {
            if (err) return rej(err);
            return res(match);
        })
    })
}
const hashPassword = (password) => {
    return new Promise((res, rej) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return rej(err); }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) { return rej(err); }
                return res(hash);
            })

        })
    })
}
userSchema.pre('save', async function(next) {
    const user = this;
    console.log('entro aqui compa');
    if (!user.isModified['password']) {
        user.password = await hashPassword(user.password);
    }
    next();
})
userSchema.methods.compare = async function(posiblePassword) {
    const user = this;
    return await compareHash(posiblePassword, user.password);
}


userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })

module.exports = mongoose.model(`User`, userSchema);
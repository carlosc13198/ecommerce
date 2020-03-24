const mongoose = require(`mongoose`);
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
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
    estado: {
        type: Boolean,
        default: true
    }
});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })

module.exports = mongoose.model(`cliente`, usuarioSchema);
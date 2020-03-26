const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    disponible: { type: Boolean, required: true, default: true },
});


module.exports = mongoose.model('Producto', productoSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Count = require('./count');

let productoSchema = new Schema({
    code: { type: String, required: false, default: '' },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descuento: { type: Number, required: false, default: 0 },
    estado: { type: Boolean, required: true, default: true },

}, { timestamps: true });
const contador = function(cont) {
    let contar = cont.toString();
    try {
        return new Promise((res, rej) => {
            if (contar.lenght <= 5) {
                for (let i = 0; i < (5 - cont); i++) {
                    contar = '0' + contar;
                }
                return res(contar);
            }
            return rej;
        })
    } catch (error) {
        return error
    }

}
productoSchema.pre('save', async function(next) {
    const code = this.code;
    if (!code || code === '') {
        const count = await Count.findOneAndUpdate({ model: 'productos' }, { $inc: { seq: 1 } }, { upsert: true });
        // const seq = await contador(count.seq);
        const seq = count.seq;
        this.code = 'PROD-' + seq;
    }
    next();
})

module.exports = mongoose.model('Producto', productoSchema);
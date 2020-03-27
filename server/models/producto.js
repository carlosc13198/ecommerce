const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Count = require('./count');

let productoSchema = new Schema({
    code: { type: String, required: false, default: '' },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    estado: { type: Boolean, required: true, default: true },

}, { timestamps: true });
const contador = function(cont) {
    let contar = cont.toSring();
    return new Promise((res, rej) => {
        if (contar.lenght <= 5) {
            for (let i = 0; i < (5 - cont); i++) {
                contar = '0' + contar;
            }
            return res(contar);
        } else {
            return rej(err);
        }
    })
}
productoSchema.pre('save', async function() {
    if (!code || code === '') {
        const count = await Count.findOneAndUpdate({ model: 'productos' }, { seq: { $inc: 1 } }, { upsert: true });
        const seq = await contador(count.seq);

        this.code = 'PROD-' + seq;
    }
})

module.exports = mongoose.model('Producto', productoSchema);
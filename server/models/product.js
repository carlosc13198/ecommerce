const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Count = require('./count');

let productSchema = new Schema({
    code: { type: String, required: false, default: '' },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descuento: { type: Number, required: false, default: 0 },
    estado: { type: Boolean, required: true, default: true },

}, { timestamps: true });
//AQUI QUISE HACER QUE LOS CODIGOS TUVIESEN EL FORMATO PROD-0000XX
//PERO NO FUNCIONO ASI QUE POR AHORA LO HE DEJADO CON PROD=XX
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
productSchema.pre('save', async function(next) {
    const code = this.code;
    if (!code || code === '') {
        const count = await Count.findOneAndUpdate({ model: 'products' }, { $inc: { seq: 1 } }, { upsert: true });
        // const seq = await contador(count.seq);
        const seq = count.seq;
        this.code = 'PROD-' + seq;
    }
    next();
})

module.exports = mongoose.model('Product', productSchema);
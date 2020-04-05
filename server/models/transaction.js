const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//ME GUSTARIA QUE REVISES ESTO YA QUE EL ERROR PODRIA ESTAR EN COMO LO HE CREADO LOS CAMPOS USER Y PRODUCT
//NO PUEDO HACER POPULATE O AGGREGATE

let transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    amount: { type: Number },
    discount: { type: Number }
}, { timestamps: true });


module.exports = mongoose.model('Transaction', transactionSchema);
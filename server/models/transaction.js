const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    amount: { type: Number },
    discount: { type: Number }
}, { timestamps: true });


module.exports = mongoose.model('Transaction', transactionSchema);
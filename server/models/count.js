const mongoose = require('mongoose');

const CountSchema = new mongoose.Schema({
    seq: { type: Number, default: 0 },
    model: { type: String }
})

module.exports = mongoose.model('Count', CountSchema);
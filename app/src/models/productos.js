const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    titulo: String,
    autor: String,
    formato: String,
    genero: String,
    estado: String,
    descuento: Number,
    valor: Number,
    stock: Number,
    image: String, 
    status: {
        type: Boolean,
        default: false
    } 
}, {
    timestamps: true
});

module.exports = mongoose.model('producto', ProductoSchema);
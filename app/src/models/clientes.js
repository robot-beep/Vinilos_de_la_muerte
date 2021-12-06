const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nombre: String,
    rut: String,
    telefono: String,
    email: String,
    contraseña: String,
    direccion: {
        calle: String,
        region: String,
        comuna: String
    },
    carrito: {
        fecha_creacion: String,
        productos: [{
            titulo: String,
            autor: String,
            formato: String,
            genero: String,
            estado: String,
            descuento: Number,
            valor: Number,
            image: String,
            cantidad: Number,
            status: {
                type: Boolean,
                default: false
            }
        }]
    },
    compras: [{
        fecha_compra: String,
        productos: [{
            titulo: String,
            autor: String,
            formato: String,
            genero: String,
            estado: String,
            descuento: Number,
            valor: Number,
            image: String,
            Cantidad: Number,
            status: {
                type: Boolean,
                default: false
            }
        }]
    }],
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('cliente', ClienteSchema);
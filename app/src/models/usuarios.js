const mongoose = require('mongoose');

const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;


const UsuarioSchema = new Schema({
    rut_cliente: String,
    nombre_cl: String,
    correo_cl: String,
    saldo: Number,
    telefono_cl: Number,
    contraseña_cl: String,
});

UsuarioSchema.methods.encryptPassword = (contraseña_cl) =>{
    return bcrypt.hashSync(contraseña_cl, bcrypt.genSaltSync(10));
};

UsuarioSchema.methods.comparePassword = function (contraseña_cl) {
    return bcrypt.compareSync(contraseña_cl,this.contraseña_cl);

};





module.exports =  mongoose.model('usuario', UsuarioSchema);

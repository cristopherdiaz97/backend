const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    nombre: {
        type:String,
        required: true,
        trim: true
    },
    apellido: {
        type:String,
        required: true,
        trim: true,
        
    },
    edad: {
        type: String,
        required: true,
        trim: true
    },
    sexo: {
        type:String,
        required: false,
        trim: true
    },
    email: {
        type:String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type:String,
        required: false
    },
    direccion: {
        type: mongoose.Types.ObjectId,
        ref: "Direccion",
        required: false
    },
    tipo: {
        type: mongoose.Types.ObjectId,
        ref: "TipoUsuario",
        required: false
    },
    membresia: {
        type: mongoose.Types.ObjectId,
        ref: "Membresia",
        required: false
    },
    perfil: {
        type: mongoose.Types.ObjectId,
        ref: "Perfil",
        required: false   
    },
    reservas:{
        type: mongoose.Types.ObjectId,
        ref: "Reservas",
        required: false
    }



}, {
    timestamps: true
});


module.exports = userSchema;
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
        type: Number,
        required: true
    },
    membresia: {
        type: Boolean,
        required: true,
        default: false
    },
    comentario: {
        type: mongoose.Types.ObjectId,
        ref: "Comentarios",
        required: false   
    },
    reservas:{
        type: mongoose.Types.ObjectId,
        ref: "Reservas",
        required: false
    },
    publicaciones: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    likes: {
        type: Number,
        default: 0
    }



}, {
    timestamps: true
});


module.exports = userSchema;
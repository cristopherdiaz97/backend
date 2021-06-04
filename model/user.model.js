const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;
const userSchema = new Schema ({
    userName:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
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
        type: Number,
        required: true,
        trim: true,
        min: 18,
        max: 100
    },
    sexo: {
        type:String,
        required: false,
        trim: true
    },
    email: {
        type:String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        data: Buffer,
        contentType: String,
        required: false
    },
    region: {
        type: ObjectId,
        ref: "Region",
        trim: true,
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
    comentarios: [{
        comentario: {
            type: String
        },
        usuario: {
            type: ObjectId,
            ref: "Users",
            required: false
        },
        respuesta: [{
            respuesta: {
                type: String
            },
            usuario: {
                type: ObjectId,
                ref: "Users",
                required: false
            }
        }]  
    }],
    reserva:{
        type: ObjectId,
        ref: "Reservas",
        required: false
    },
    likes: {
        type: Number,
        default: 0
    }



}, {
    timestamps: true
});


module.exports = mongoose.model('Users', userSchema);
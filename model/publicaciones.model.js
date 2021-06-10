const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const publicacionSchema = new Schema ({
    nombre: {
        type:String,
        required: true,
        trim: true
        
    },
    descripcion: {
        type:String,
        required: true,
        trim: true,
        
    },
    likes: {
        type: Number,
        default: 0
    },
    img: {
        data: Buffer,
        contentType: String,
        
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
    creador:{
        type: ObjectId,
        ref: "Users",
        required: true
    },
    estiloTatuaje: {
        type: ObjectId,
        ref: "estilosTatuajes",
        required: false
    },
    etiquetado:{
        type: ObjectId,
        ref: "Users",
        required: false
    },
    likes: {
        type: Number,
        default: 0,
        
    }



}, {
    timestamps: true
});


module.exports = mongoose.model('Publicaciones', publicacionSchema);
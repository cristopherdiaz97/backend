const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const proyectoSchema = new Schema ({
    nombre: {
        type:String,
        required: true,
        trim: true
        
    },
    tamaño: {
        type:String,
        required: true,
        trim: true,
        
    },
    parteCuerpo: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        data: Buffer,
        contentType: String,
    },
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
    oferta: [
            {
                type: ObjectId,
                ref: "Oferta",
                required: false
            }       
    ],
    estado: {
        type: ObjectId,
        ref: "Estado",
        required: true
        
    }



}, {
    timestamps: true
});


module.exports = mongoose.model('Proyectos', proyectoSchema);
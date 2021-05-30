const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const ofertaSchema = new Schema ({
    ofertante: {
        type: ObjectId,
        ref: "Users",
        required: true
    },
    descripcion: {
        type:String,
        required: true,
        trim: true,
        
    },
    valor: {
        type: Number,
        required: true,
        trim: true
    },
    estado: {
        type: ObjectId,
        ref: "Estado",
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Oferta", ofertaSchema);
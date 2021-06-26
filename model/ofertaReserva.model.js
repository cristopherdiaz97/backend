const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema

const ofertaReservaSchema = new Schema({
    ofertante:{
        type: ObjectId,
        ref: "Users"
    },
    descripcion: {
        type: String,
        required: true
    },
    proyecto: {
        type: ObjectId,
        ref: "Proyectos"
    },
    estado: {
        type: ObjectId,
        ref: "Estado",
        required: true
        
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('OfertaReserva', ofertaReservaSchema);
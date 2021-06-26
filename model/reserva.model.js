const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema

const reservaSchema = new Schema({
    creador:{
        type: ObjectId,
        ref: "Users"
    },
    fecha: {
        type: Date,
        required: true,
    },
    fechaFin: {
        type: Date,
        required: true,
    },
    estado: {
        type: ObjectId,
        ref: "Estado"
    },
    oferta: [{
        type: ObjectId,
        ref: "OfertaReserva"
    }]
},
{
    timestamps : true
});

module.exports = mongoose.model('Reserva', reservaSchema);
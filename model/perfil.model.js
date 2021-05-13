const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const perfilSchema = new Schema ({
    comentario:{
        type: mongoose.Types.ObjectId, 
        ref: "Comentarios",
        require: false
    },
    valoracion: {
        type: mongoose.Types.ObjectId,
        ref: "Valoracion",
        require: false
    },
    publicacion:{
        type: mongoose.Types.ObjectId,
        ref: "Publicacion",
        require: false
    }




}, {
    timestamps: true
});

module.exports = perfilSchema;
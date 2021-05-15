const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const tatuajeSchema = new Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
        unique: true
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('estilosTatuajes', tatuajeSchema);
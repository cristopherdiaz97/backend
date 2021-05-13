const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const tatuajeSchema = new Schema({
    estilo:{
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps : true
});

module.exports = tatuajeSchema;
const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const tipoUsuarioSchema = new Schema({
    tipo:{
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps : true
});

module.exports = tipoUsuarioSchema;
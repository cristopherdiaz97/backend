const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const direccionSchema = new Schema({
    
    calle:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    numero:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    comuna:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    region:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },

},
{
    timestamps : true
});

module.exports = mongoose.model('Direccion', direccionSchema);
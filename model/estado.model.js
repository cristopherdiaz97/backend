const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const estadoSchema = new Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps : true
});

module.exports = estadoSchema;
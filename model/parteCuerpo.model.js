const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const parteCuerpoSchema = new Schema({
   
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

module.exports = mongoose.model('Parte', parteCuerpoSchema);
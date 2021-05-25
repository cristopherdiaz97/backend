const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const regionSchema = new Schema({
   
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

module.exports = mongoose.model('Region', regionSchema);
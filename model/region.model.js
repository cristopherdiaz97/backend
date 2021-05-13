const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const regionSchema = new Schema({
    region:{
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('Region', regionSchema);
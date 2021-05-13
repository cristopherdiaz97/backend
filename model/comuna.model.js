const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const comunaSchema = new Schema({
    comuna:{
        type: String,
        required: true,
        trim: true
    },
    region:{
        type: mongoose.Types.ObjectId,
        ref: "Region",
        required: true
    }
},
{
    timestamps : true
});

module.exports = comunaSchema;
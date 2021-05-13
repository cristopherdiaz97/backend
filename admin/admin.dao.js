const mongoose = require ('mongoose');
const regionSchema = require ('../model/region.model');
// const comunaSchema = require ('../model/comuna.model');
// const estiloTatuajeSchema = require ('../model/tatuajes.model');
// const estadoSchema = require ('../model/estado.model');
// const tipoUsuSchema = require ('../model/tipoUsu.model');

regionSchema.statics = {
    createRegion: function (data, cb){
        
        console.log(data, "DATAAAAAAA");
        const region = new this(data);
        
        region.save(cb);
    }   
}
// Crear colleccion Region
const regionModel = mongoose.model('Region', regionSchema);
module.exports = regionModel;

// tipoUsuSchema.static = {
//     createTipoUsu: function (data, cb){
//         const tipoUsu = new this (data);
//         tipoUsu.save(cb);
//     }
// }

// comunaSchema.statics = {
//     createComuna: function(data, cb){
//         const comuna = new this(data);
//         comuna.save(cb);
//     }
// }

// estiloTatuajeSchema.static = {
//     createEstilos: function (data, cb){
//         const estilosTatuajes = new this(data);
//         estilosTatuajes.save(cb); 
//     }
// }

// estadoSchema.static = {
//     createEstados: function (data, cb){
//         const estados = new this (data);
//         estados.save(cb);
//     }
// }

// // Crear colleccion tipo usuarios
// const tipoUsuModel = mongoose.model('Tipo_usuario', tipoUsuSchema);
// module.exports = tipoUsuModel;

// // Crear colleccion Estados
// const estadoModel = mongoose.model('Estados', estadoSchema);
// module.exports = estadoModel;

// // Crear estilos de tatuajes
// const estiloTatuajeModel = mongoose.model('Estilos', comunaSchema);
// module.exports = estiloTatuajeModel;

// // Crear colleccion Comunas
// const comunaModel = mongoose.model('Comuna', comunaSchema);
// module.exports = comunaModel;


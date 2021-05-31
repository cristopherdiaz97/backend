const Oferta = require ('../model/ofertas.model');
const Estado = require ('../model/estado.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');
const Proyecto = require ('../model/proyecto.model');



exports.create = (req, res, next) => {
    const proyecto = req.proyecto
    const perfil = req.profile
    const oferta = new Oferta(req.body)
    const {descripcion, valor, estado} = oferta
    oferta.ofertante = perfil._id
    
    Estado.findById(proyecto.estado).exec((err, estado) => {
        if(err || !estado) {
            return res.status(400).json({
                error: 'Estado no encontrado'
              }); 
        }
       
        if(estado.nombre === 'Terminado'){
            return res.status(200).json({
                mensaje: `El proyecto: ${proyecto.nombre} ha sido Terminado!`
            })
        }
    })

    if(!descripcion, !valor, !estado) {
        return res.status(400).json({
          error: 'Debe ingresar todos los campos obligatorios!'
        }); 
    }

    if(!proyecto, !perfil){
        return res.status(400).json({
            mensaje: 'Oops! ha ocurrido un error'
        })
    }
    
    if(proyecto.creador._id.equals(perfil._id) ){
        return res.status(400).json({
            mensaje: 'No puedes realizar ofertas a tu propio proyecto!'
        })
    }
    
    oferta.save((err, ofertaIngresada) => {
        
        if(err){
            return res.status(400).json ({
                error : errorHandler(err)
            })
        }
        Proyecto.updateOne({ _id: proyecto._id}, 
            {
                $push: { 
                    oferta: ofertaIngresada._id
            }
            })
            .exec( (err, result) => {
                if(err){
                    return res.status(400).json({error : err})
                }else{
                    res.json({
                        text: `Tu oferta ha sido ingresada con exito al proyecto: ${proyecto.nombre}`,   
                    })
                }
            })
    })
};

exports.ofertaPorId = (req, res, next, id) => {
    Oferta.findById(id).exec((err, oferta) => {
        if(err || !oferta) {
            return res.status(400).json({
                error: 'Oferta no encontrado'
              }); 
        }
        req.oferta = oferta;
        next();
    })
};
// exports.buscar = (req, res) => {
//     return res.json(req.estado);
// }

exports.eliminar = (req, res) => {
    oferta = req.oferta
    user = req.profile
    if(user._id.equals(oferta.ofertante._id) || user.tipo == 0){
        
        oferta.remove((err, ofertaEliminada)=>{
            if(err){
                return res.status(400).json(err);
            }
            res.json({
                mensaje: `Su oferta ha sido eliminada con exito!`
            })
        }
        );
    }else {
        return res.status(400).json ({mensaje : 'No tienes permisos para realizar esta acción'})
    }

    
}

exports.modificar = (req, res) => {
    
    const oferta = req.oferta
    const user = req.profile
    
    if(!req.body.descripcion || !req.body.valor) {
        return res.status(400).json ({mensaje: 'Debe rellenar todos los campos obligatorios!'})
    }

    if(user._id.equals(oferta.ofertante._id) || user.tipo == 0){
        oferta.descripcion = req.body.descripcion
        oferta.valor = req.body.valor
        oferta.save((error,data) =>{

            if(error){
                return res.status(400).json (error)
            }
            res.json({ data })
    
      });
    }else {
        return res.status(400).json ({mensaje : 'No tienes permisos para realizar esta acción'})
    }


};

exports.respuestaOferta = (req, res) => {
    
    const proyecto = req.proyecto
    const oferta = req.oferta
    const user = req.profile
    const respuesta = req.body.respuesta
    //COMPARA AL CREADOR DEL PROYECTO, PARA QUE SOLO EL PUEDA INGRESAR UNA RESPUESTA A SUS OFERTAS
    if(proyecto.creador._id.equals(user._id)) {
        
        // SI NO EXISTE RESPUESTA, DEBE INGRESAR UNA RESPUESTA
        if(!respuesta){
            res.status(400).json({
                mensaje: 'Debes ingresar una respuesta'
            })
        }
        // SI LA RESPUESTA TIENE VALOR 1, LA OFERTA SERÁ RECHAZA POR EL USUARIO
        if(respuesta == 1) {

            //BUSCA ESTADO CON VALOR RECHAZADO, PARA LUEGO MODIFICAR LA OFERTA RECHAZADA A SU NUEVO ESTADO
            Estado.findOne({nombre: 'Rechazado'})
            .exec((err, estado) => {
                if(err) {
                    return res.status(400).json({
                        error: 'No existen estados aún!'
                    }); 
                }
                oferta.estado = estado._id
                oferta.save((error,oferta) =>{

                    if(error){
                        return res.status(400).json (error)
                    }
                        res.json({ 
                            mensaje: 'Haz rechazado una oferta!', 
                            oferta })
                    
                });
            })
            //SI LA RESPUESTA ES 0, SIGNIFICA QUE ACEPTA LA OFERTA ENVIADA AL PROYECTO 
        }else if (respuesta == 0) {
            //BUSCA ESTADO CON VALOR ACEPTADO, PARA LUEGO MODIFICAR LA OFERTA ACEPTADA A SU NUEVO ESTADO
            Estado.findOne({nombre: 'Aceptado'})
            .exec((err, estado) => {
                if(err) {
                    return res.status(400).json({
                        error: 'No existen estados aún!'
                    }); 
                }
                oferta.estado = estado._id
                oferta.save((error,oferta) =>{

                    if(error){
                        return res.status(400).json (error)
                    }  
                    return res.status(200).json({
                        mensaje: 'Felicidades, haz aceptado una oferta!',
                        oferta: oferta
                    })
                });
            })   
        }
    }else{
        res.status(400).json({
            mensaje: 'No estas autorizado a realizar esta acción!'
        })
    }

};

// exports.listaEstados = (req, res) => {
//     Estado.find().exec((err, data) => {
//         if(err) {
//             return res.status(400).json({
//                 error: 'No existen estados aún!'
//               }); 
//         }
//         res.json({data})
//     })
// };
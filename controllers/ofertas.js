const Oferta = require ('../model/ofertas.model');
const Estado = require ('../model/estado.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');
const Proyecto = require ('../model/proyecto.model');


exports.create = (req, res, next) => {
    const proyecto = req.proyecto
    const perfil = req.profile
    const oferta = new Oferta({
        descripcion: req.body.descripcion,
        valor: req.body.valor
    })
    console.log(oferta);
    const {descripcion, valor} = oferta
    oferta.ofertante = perfil._id
    if(proyecto.estado.nombre === 'Terminado') {
        return res.json({
            error: `El proyecto ${proyecto.nombre} esta terminado`
        })
    }
    
    if(!descripcion, !valor) {
        return res.status(400).json({
          error: 'Debe ingresar todos los campos obligatorios!'
        }); 
    }
    
    const regex = /^\$?(?!0.00)(([0-9]{1,3}.([0-9]{3}.)*)[0-9]{3}|[0-9]{1,3})(\,[0-9]{2})?$/
    if(!regex.test(valor)) return res.status(400).json({error: 'Debe ingresar un valor valido'})

    if(!proyecto, !perfil){
        return res.status(400).json({
            error: 'Oops! ha ocurrido un error'
        })
    }
    
    if(proyecto.creador._id.equals(perfil._id) ){
        return res.status(400).json({
            error: 'No puedes realizar ofertas a tu propio proyecto!'
        })
    }
    Estado.findOne({nombre: 'En espera'}).exec((err, estado) => {
        if(err || !estado) {
            return res.status(400).json({
                error: 'Oops ha ocurrido un error'
            })
        }
        
        oferta.estado = estado._id
        
        oferta.save((err, ofertaIngresada) => {
        
            if(err){
                return res.status(400).json ({
                    error : 'Ha ocurrido un error'
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
                        return res.status(400).json({error : 'Ha ocurrido un error'})
                    }else{
                        return res.json({
                            mensaje: `Tu oferta ha sido ingresada con exito al proyecto: ${proyecto.nombre}`,   
                        })
                    }
                })
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

exports.buscar = (req, res) => {
    
    const proyecto = req.proyecto
    const oferta = req.oferta
    const usuario = req.profile

    // Buscar la publicación el proyecto solo si es el creador.
    if(usuario._id.equals(proyecto.creador._id)){

        Oferta.findById(oferta._id)
        .populate({path: 'ofertante', model: 'Users', select: 'userName'})
        .populate({path: 'estado', model: 'Estado', select: 'nombre'})
        .exec((err, oferta) => {
            if(err || !oferta) {
                return res.status(400).json({
                    error: 'Oferta no encontrada'
                  }); 
            }
            return res.json({oferta})
            
        })
    }
    else{
        return res.status(200).json({
            error: 'No puedes visualizar esta oferta porque no eres propietario del proyecto'
        })
    }
}

exports.eliminar = (req, res) => {
    oferta = req.oferta
    user = req.profile
    if(user._id.equals(oferta.ofertante._id) || user.tipo == 0){
        oferta.remove((err, ofertaEliminada)=>{
            if(err){
                return res.status(400).json({error: 'Ha ocurrido un error'});
            }
            res.json({
                mensaje: `Su oferta ha sido eliminada con exito!`
            })
        }
        );
    }else {
        return res.status(400).json ({error : 'No tienes permisos para realizar esta acción'})
    }
}

exports.modificar = (req, res) => {
    
    const oferta = req.oferta
    const user = req.profile
    
    if(!req.body.descripcion || !req.body.valor) {
        return res.status(400).json ({error: 'Debe rellenar todos los campos obligatorios!'})
    }
    const regex = /(?=.*\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/
    if(!regex.test(req.body.valor)) return res.status(400).json({error: 'Debe ingresar un valor valido'})

    if(user._id.equals(oferta.ofertante._id) || user.tipo == 0){
        oferta.descripcion = req.body.descripcion
        oferta.valor = req.body.valor
        oferta.save((error,data) =>{

            if(error){
                return res.status(400).json ({error: 'Ha ocurrido un error'})
            }
            res.json({ data })
    
      });
    }else {
        return res.status(400).json ({error : 'No tienes permisos para realizar esta acción'})
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
                error: 'Debes ingresar una respuesta'
            })
        }
        // SI LA RESPUESTA TIENE VALOR 1, LA OFERTA SERÁ RECHAZA POR EL USUARIO
        if(respuesta == 'rechazar') {
            
            if(proyecto.estado.nombre == 'Terminado'){
                return res.json({
                    error: 'Tu proyecto esta terminado, no puedes manipular ofertas'
                })
            }
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
                        return res.status(400).json ({error: 'Ha ocurrido un error'})
                    }
                        res.json({ 
                            mensaje: 'Haz rechazado una oferta!', 
                            oferta 
                        })
                    
                });
            })
            //SI LA RESPUESTA ES 0, SIGNIFICA QUE ACEPTA LA OFERTA ENVIADA AL PROYECTO 
        }else if (respuesta == 'aceptar') {
            //BUSCA ESTADO CON VALOR ACEPTADO, PARA LUEGO MODIFICAR LA OFERTA ACEPTADA A SU NUEVO ESTADO
           if(proyecto.estado.nombre == 'Terminado'){
               return res.json({
                   error: 'Tu proyecto esta terminado no puedes manipular ofertas'
               })
           }

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

                    Estado.findOne({nombre: 'Terminado'})
                    .exec((err, result) => {
                        
                        if(err) {
                            return res.status(400).json({ 
                                error: 'Ha ocurrido un error'
                            })
                        }
                        
                        Proyecto.findByIdAndUpdate({_id: proyecto._id}, {
                            estado: result._id
                        }).exec((err, resultado) => {
                            if(err){
                                return res.status()
                            }
                            if(resultado){
                                return res.status(200).json({
                                    mensaje: 'Felicidades, haz aceptado una oferta!',
                                    oferta: oferta
                                })
                            }
                            
                        })    
                        
                    })
                });
              
            })

        }
    }else{
        res.status(400).json({
            error: 'No estas autorizado a realizar esta acción!'
        })
    }

};

exports.listadoOfertas = (req, res) => {
    const user = req.profile

    Oferta.find({ofertante: user._id})
    .populate('estado', 'nombre')
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Ha ocurrido un error'
              }); 
        }
        
        if(data.length === 0){
            res.json({error: 'Aún no haz realizado ninguna oferta'})
        }else{
        res.json({data})}
    })
};
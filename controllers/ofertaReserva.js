const Oferta = require ('../model/ofertaReserva.model');
const  Reserva = require ('../model/reserva.model')
const Estado = require ('../model/estado.model')
exports.create = (req, res, next ) => {
    
    const oferta = new Oferta ({
        ofertante: req.profile._id,
        descripcion: req.body.descripcion, 
         
    })
    //Evalua si el proyecto que adjunto el usuario pertenece a este
    if(req.body.idProyecto){
        oferta.proyecto = req.body.idProyecto  
    }
    
    Estado.findOne({nombre: 'En espera'})
        .exec((err, estado) => {
            if(err || !estado) {
                return res.status(400).json({
                    error: 'No existen estados aún!'
                }); 
            }
            oferta.estado = estado._id
            oferta.save((err, ofertaIngresada) => {
        
                if(err){
                    return res.status(400).json ({
                        error : 'Ha ocurrido un error'
                    })
                }
                Reserva.updateOne({ _id: req.body.reservaId}, 
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
                                mensaje: `Tu hora ha sido agendada con éxito`,   
                            })
                        }
                    })
            })
        })
    
}

exports.ofertaPorId = (req, res, next, id) => {
    Oferta.findById(id).exec((err, oferta) => {
        if(err || !oferta) {
            return res.status(400).json({
                error: 'Oferta no encontrada'
              }); 
        }
        req.oferta = oferta;
        next();
    })
};


exports.respuestaOferta = (req, res) => {
    
    const reserva = req.reserva
    const oferta = req.oferta
    const user = req.profile
    const respuesta = req.body.respuesta
    
    //COMPARA AL CREADOR DEL PROYECTO, PARA QUE SOLO EL PUEDA INGRESAR UNA RESPUESTA A SUS OFERTAS
    if(reserva.creador._id.equals(user._id)) {
        
        // SI NO EXISTE RESPUESTA, DEBE INGRESAR UNA RESPUESTA
        if(!respuesta){
            res.status(400).json({
                error: 'Debes ingresar una respuesta'
            })
        }
        // SI LA RESPUESTA TIENE VALOR 1, LA OFERTA SERÁ RECHAZA POR EL USUARIO
        if(respuesta == 'rechazar') {
            
            if(reserva.estado.nombre == 'Agendada'){
                return res.json({
                    error: 'Esta hora esta terminada'
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
                            mensaje: 'Haz rechazado una oferta!'
                        })
                    
                });
            })
            //SI LA RESPUESTA ES 0, SIGNIFICA QUE ACEPTA LA OFERTA ENVIADA AL PROYECTO 
        }else if (respuesta == 'agendar') {
            //BUSCA ESTADO CON VALOR ACEPTADO, PARA LUEGO MODIFICAR LA OFERTA ACEPTADA A SU NUEVO ESTADO
           if(reserva.estado.nombre == 'Agendada'){
               return res.json({
                   error: 'Tu hora ya esta agendada'
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

                    Estado.findOne({nombre: 'Agendada'})
                    .exec((err, result) => {
                        
                        if(err) {
                            return res.status(400).json({ 
                                error: 'Ha ocurrido un error'
                            })
                        }
                        Reserva.findByIdAndUpdate({_id: reserva._id}, {
                            estado: result._id
                        }).exec((err, resultado) => {
                            if(err){
                                return res.status()
                            }
                            if(resultado){
                                return res.status(200).json({
                                    mensaje: 'Felicidades, haz aceptado una oferta!'
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
exports.listaOfertas = (req, res) => {

    const user = req.profile

    Oferta.find({ofertante: user._id})
    .populate('estado', 'nombre')
    .populate({path: 'proyecto', select: 'nombre img', populate:{path: 'estado', select: 'nombre'}})
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
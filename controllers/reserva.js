const Reserva = require ('../model/reserva.model');
const Estado = require ('../model/estado.model')
const moment = require ('moment')
const User = require('../model/user.model')
exports.create = (req, res, next ) => {
        if(req.profile.limitReserve > 5 ){
            return res.status(400).json({
                error: 'Has superado tu límite de reservaciones'
            })
        }
        if(req.profile.tipo === 1){
        const reserva = new Reserva({
            creador: req.profile._id,
            fecha: req.body.fecha,
            fechaFin: req.body.fechaFin
        })
        
        Estado.findOne({nombre: 'En espera'})
            .exec((err, estado) => {
                if(err || !estado) {
                    return res.status(400).json({
                        error: 'No existen estados aún!'
                    }); 
                }
            reserva.estado = estado._id
            reserva.save((err, result) => {
                if(err){
                    return res.status(400).json({
                        error: 'Ha ocurrido un error inesperado'
                    });
                }
                User.findByIdAndUpdate(req.profile._id, 
                   {limitReserve : req.profile.limitReserve +1}
                ).exec((err, result) => {
                    if(err){
                        return res.status(400).json({
                            error:'Ha ocurrido un error innesperado'
                        })
                    }
                })
                         
                res.json({
                    mensaje: "Has agendado una nueva hora"
                });
                
            })
        })
    }else {
        return res.status(400).json({
            error: 'Debes ser tatuador para crear tu agenda'
        })
    }
    
    
}

exports.reservaPorId = (req, res, next, id) => {
    
    Reserva.findById(id)
    .populate('estado', 'nombre')
    .populate('creador', 'userName')
    .select('-oferta -createdAt -updatedAt -__v')
    .exec((err, reserva) => {
        if(err || !reserva) {
            return res.status(400).json({
                error: 'Hora agendada no ha sido encontrada'
              }); 
        }
        req.reserva = reserva;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.reserva);
}

exports.listaReservas = (req, res) => {
    Reservas.find()
    .populate('estado', 'nombre')
    .populate('creador', 'userName')
    .populate('oferta', 'ofertante')
    .populate({path: 'oferta', populate: {path:'estado', select: 'nombre'}})
    .populate({path: 'oferta', populate: { path: 'ofertante', select: 'userName'}})
    .populate({path: 'oferta', populate: { path: 'proyecto', select: 'nombre img', populate:{path: 'estado', select: 'nombre'}}})
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen horas agendas aún!'
              }); 
        }
        res.json({data})
    })
};

exports.modificar = (req, res) => {
        let reserva = req.reserva
        if(req.body.fecha){
            reserva.fecha = req.body.fecha
            reserva.fechaFin = req.body.fechaFin
        }

        reserva.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: 'Ha ocurrido un error'
                });
            }
            res.json({
                mensaje: 'Haz modificado tu agenda con éxito!',
            });
               
        })
    
}

exports.eliminar = (req, res) => {
    let reserva = req.reserva
    
    
    reserva.remove((err, horaEliminada)=>{
        if(err){
            return res.status(400).json({error: 'Ha ocurrido un error'});
        }
        User.findByIdAndUpdate(req.profile._id, 
            {limitReserve : req.profile.limitReserve -1}
         ).exec((err, result) => {
             if(err){
                 return res.status(400).json({
                     error:'Ha ocurrido un error innesperado'
                 })
             }
         })
        res.json({
            mensaje: `Tu hora agendada ha sido eliminada con éxito`
        })
    }
    );
}

exports.listaHorasUsuarios = (req, res) => {

    Reserva.findById(req.body.idReserva)
    .populate('estado', 'nombre')
    .populate('creador', 'userName')
    .populate('oferta', 'ofertante')
    .populate({path: 'oferta', populate: {path:'estado', select: 'nombre'}})
    .populate({path: 'oferta', populate: { path: 'ofertante', select: 'userName'}})
    .populate({path: 'oferta', populate: { path: 'proyecto', select: 'nombre img', populate:{path: 'estado', select: 'nombre'}}})
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Ha ocurrido un error'
              }); 
        }
        if(data.length === 0){
            res.json({error: 'Aún no agendas horas'})
        }else{
        res.json({data})}
    })
};

exports.miAgenda = (req, res) => {
    if(req.profile.tipo === 1){
        Reserva.find({ creador: req.profile._id})
        .populate('estado', 'nombre')
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: 'Ha ocurrido un error'
                  }); 
            }
            if(data.length === 0){
                res.json({error: 'Aún no agendas horas'})
            }else{
            res.json({data})}
        })
    } else {
        return res.status(400).json({
            error: 'Debes ser tatuador para revisar tu agenda'
        })
    }
    
};

exports.listaAgenda = (req, res) => {

    Reserva.find({ creador: req.body.idPerfil})
    .populate('estado', 'nombre')
    .select('-oferta')
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Ha ocurrido un error'
              }); 
        }
        if(data.length === 0){
            res.json({error: 'Aún no se crean horas de atención'})
        }else{
        res.json({data})}
    })
};

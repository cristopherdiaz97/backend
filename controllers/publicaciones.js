const Publicaciones = require ('../model/publicaciones.model');
const { errorHandler } = require ('../helpers/dbErrorHandler');
const _ = require( 'lodash');
const formidable = require ('formidable');
const fs = require ('fs');
exports.create = (req, res, next ) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, files) => {

        
        if(err){
            return res.status(400).json({
                error: 'No se pudo cargar imagen'
            })
        }
        
        let publicacion = new Publicaciones (fields)

        // 1kb = 1000b
        // 1mb = 1000000b
        const {nombre, descripcion, estiloTatuaje} = fields
        if(!nombre || !descripcion || !estiloTatuaje){
            return res.status(400).json({
                error: 'Debe rellenar todos los campos Obligatorios!'
            })
        }

        if(files.img){
            //Tamaño mayor a 1mb 
            if(files.img.size > 1000000){
                return res.status(400).json({
                    error: 'La imagen no puede superar 1mb en tamaño'
                })
            }

            publicacion.img.data = fs.readFileSync(files.img.path);
            publicacion.img.contentType = files.img.type;
        } else {
            return res.status(400).json({
                error: 'Tu publicación debe contener imagen'
            })
        }

        publicacion.creador = req.profile._id
        publicacion.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: 'Ha ocurrido un error'
                });
            }
                
            res.json({result});
               
        })

    });
    
}

exports.publicacionPorId = (req, res, next, id) => {
    Publicaciones.findById(id)
    .populate('comentarios', 'comentario')
    .populate('creador', 'userName img')
    .populate('estiloTatuaje', 'nombre')
    .populate('likes', 'userName')
    .populate( {path: 'comentarios', populate: {path: 'usuario', select: 'userName'}})
    .populate({path: 'comentarios', populate: { path: 'usuario', select: 'userName'}, populate: {path:'respuesta', populate: {path: 'usuario', select: 'userName'}}})
    .exec((err, publicacion) => {
        if(err || !publicacion) {
            return res.status(400).json({
                error: 'Publicacion no encontrado'
              }); 
        }
        req.publicacion = publicacion;
        next();
    })
};

exports.buscar = (req, res) => {
    return res.json(req.publicacion);
}

exports.eliminar = (req, res) => {
    let publicacion = req.publicacion

    publicacion.remove((err, publicacionEliminada)=>{
        if(err){
            return res.status(400).json({error: 'Ha ocurrido un error'});
        }
        res.json({
            mensaje: `Publicacion ${publicacionEliminada.nombre} eliminada con exito!`
        })
    }
    );
}

exports.modificar = (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, files) => {


        if(err){
            return res.status(400).json({
                error: 'No se pudo cargar imagen'
            })
        }
        
        let publicacion = req.publicacion
        publicacion = _.extend(publicacion, fields)

        
        publicacion.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: 'Ha ocurrido un error'
                });
            }
            
            res.json({result});
               
        })
    });

};

exports.respuestaComentario = (req, res) => {
    const publicacion = req.publicacion
    if(!req.body.respuesta || !req.body.id){
        return res.json({
            error: 'Comentario no debe ir vacío!'
        })
    }
    Publicaciones.updateOne(
        { '_id': publicacion._id, 'comentarios._id': req.body.id },
        {
            $push: { 
                'comentarios.$.respuesta': 
                {
                    respuesta: req.body.respuesta, 
                    usuario: req.profile._id
                }
        }
        })
        .populate('comentarios._id')
        .exec( (err, result) => {
            if(err || !result){
                return res.status(400).json({error : 'Ha ocurrido un error'})
            }else{
                res.json({
                    mensaje: 'Comentario agregado!',
                    
                })
            }
        }) 
    
}

exports.eliminarRespuesta = (req, res) => {
    const publicacion = req.publicacion
    if(publicacion.creador._id.equals(req.profile._id) || req.profile._id.equals(req.body.idUser)){
        
        Publicaciones.updateOne(
            { '_id': publicacion._id, 'comentarios._id': req.body.idComentario },
            {
                $pull: { 
                    "comentarios.$.respuesta": {_id: req.body.idRespuesta}
            }
            })
            .exec( (err, result) => {
                if(err){
                    return res.status(400).json({error : 'Ha ocurrido un error'})
                }else{
                    res.json({
                        mensaje: 'Respuesta eliminada con exito'
                    })
                }
            }) 
    } else {
        return res.status(400).json({
            error: 'No tienes permisos para hacer esto!'
        })
    }
}

exports.hacerComentario = (req, res) => {
    if(!req.body.comentario){
        return res.json({
            error: 'Comentario no debe ir vacío!'
        })
    }
    const publicacion = req.publicacion
    
    Publicaciones.updateOne({ _id: publicacion._id}, 
    {
        $push: { 
        comentarios: {comentario: req.body.comentario, usuario: req.profile._id}
    }
    }
    ).populate('comentarios._id')
    .exec( (err, result) => {
        if(err){
            return res.status(400).json({error : err})
        }else{
            res.json({
                mensaje: 'Comentario agregado con exito!',
            })
        }
    })  
    
}

exports.eliminarComentario = (req, res) => {
    
    const publicacion = req.publicacion
    
    if(publicacion.creador._id.equals(req.profile._id) || req.profile._id.equals(req.body.idUser)){

        Publicaciones.updateOne(
            { '_id': publicacion._id},
            {
                $pull: { 
                    comentarios: {_id : req.body.idComentario},
            }
            })
            .exec( (err, result) => {
                if(err || !result){
                    return res.status(400).json({error : 'Ha ocurrido un error'})
                }else{
                    res.json({
                        mensaje: 'Comentario eliminado con exito!',
                        
                    })
                }
            }) 
        } else {
            return res.status(400).json({
                error: 'No tienes permisos para hacer esto'
            })
        }
}

exports.listaPublicaciones = (req, res) => {
    let order = req.query.order ? req.query.order : 'desc'
    let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'
    let limit = req.query.limit ? parseInt(req.query.limit) : 100
        Publicaciones.find()
        .select('-img')
        .populate('creador', 'userName img')
        .populate('estiloTatuaje', 'nombre')
        .populate('likes', 'userName')
        .populate( {path: 'comentarios', populate: {path: 'usuario', select: 'userName'}})
        .populate({path: 'comentarios', populate: { path: 'usuario', select: 'userName'}, populate: {path:'respuesta', populate: {path: 'usuario', select: 'userName'}}})
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if(err) {
                return res.status(400).json({
                    error: 'No existen publicaciones aún!'
                }); 
            }
            if(data.length === 0) {
                return res.status(400).json({
                    error: 'Se el primero en publicar algo'
                })
            }
            res.json({data})
        })    
};

exports.listaPublicacionesBusqueda = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
                findArgs[key] = req.body.filters[key];
        }
    }
    
    Publicaciones.find(findArgs)
        .select('-img')
        .populate('creador', 'userName img')
        .populate('estiloTatuaje', 'nombre')
        .populate('likes', 'userName')
        .populate( {path: 'comentarios', populate: {path: 'usuario', select: 'userName'}})
        .populate({path: 'comentarios', populate: { path: 'usuario', select: 'userName'}, populate: {path:'respuesta', populate: {path: 'usuario', select: 'userName'}}})
        .skip(skip)
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Publicacion no encontrada"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.likePublicacion = async (req, res) => {

    try{
        const publicacion = await Publicaciones.findById(req.body.idPublicacion)
    if( !publicacion.likes.includes(req.profile._id)){
        await publicacion.updateOne({$push: {likes: req.profile._id}})
        res.json({
            mensaje: 'like'
        })
    } else {
        await publicacion.updateOne({$pull: {likes: req.profile._id}})
        res.json({
            mensaje: 'dislike'
        })
    }

    }catch (err){
        res.status(500).json({
            error: 'Ha ocurrido un error innesperado'
        })
    }
}

exports.listaPublicacionesUsuarios = (req, res) => {
    const user = req.profile
    Publicaciones.find({creador: user._id})
    .populate('comentarios', 'comentario')
    .populate('creador', 'userName')
    .populate('estiloTatuaje', 'nombre')
    .populate('likes', 'userName')
    .populate( {path: 'comentarios', populate: {path: 'usuario', select: 'userName'}})
    .populate({path: 'comentarios', populate: { path: 'usuario', select: 'userName'}, populate: {path:'respuesta', populate: {path: 'usuario', select: 'userName'}}})
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'Ha ocurrido un error'
              }); 
        }
        if(data.length === 0){
            res.json({error: 'Aún no tienes publicaciones'})
        }else{
        res.json({data})}
    })
};

exports.img = (req, res, next) => {
    if(req.publicacion.img.contentType == null){
        return res.json({error: 'No se pudo cargar tú imagen o no existe!'})
    }
    
    if(req.publicacion.img.data){
        res.set('Content-Type', req.publicacion.img.contentType)
        
        return res.send(req.publicacion.img.data)
    }
    
    next()
}
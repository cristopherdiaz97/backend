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

        const {nombre, descripcion, estiloTatuaje, tatuado} = fields
        if(!nombre || !descripcion || !estiloTatuaje || !tatuado){
            return res.status(400).json({
                error: 'Debe rellenar todos los campos Obligatorios!'
            })
        }

        if(files.img.type == null){
            return res.json({
                error: 'Tú publicación debe contener una imagen'
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
    .populate('comentarios')
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
        // 1kb = 1000b
        // 1mb = 1000000b

        const {nombre, descripcion} = fields
        if(!nombre || !descripcion){
            return res.status(400).json({
                error: 'Debe rellenar todos los campos Obligatorios!'
            })
        }

        if(files.img.type == null){
            return res.json({
                error: 'Tú publicación debe contener una imagen'
            })
        }

        if(files.img){
            //Tamaño mayor a 1mb 
            if(files.img.size > 1000000 ){
                return res.status(400).json({
                    error: 'Debe seleccionar una imagen que no supere 1mb de tamaño'
                })
            }

            publicacion.img.data = fs.readFileSync(files.img.path);
            publicacion.img.contentType = files.img.type;
             
        }
        
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
            if(err){
                return res.status(400).json({error : err})
            }else{
                res.json({
                    mensaje: 'Comentario agregado!',
                    
                })
            }
        }) 
    
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

exports.listaPublicaciones = (req, res) => {
    Publicaciones.find()
    .populate('comentarios', 'comentario')
    .populate('creador', 'nombre')
    .populate('estiloTatuaje', 'nombre')
    .populate('tatuado', 'userName')
    .exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen publicaciones aún!'
              }); 
        }
        res.json({data})
    })
};

exports.likePublicacion = (req, res) => {
    const publicacion = req.publicacion
    if(publicacion){
    publicacion.likes = publicacion.likes + 1 
    publicacion.save((err, result) => {
        
        if(err){
            return res.status(400).json({
                error: 'Ha ocurrido un error'
            });
        }
            
        res.json({likes: req.publicacion.likes});
           
    })
    }else{
        res.json({error: 'Oops! no pudiste dar like!' })
    }
}

exports.listaPublicacionesUsuarios = (req, res) => {
    const user = req.profile

    Publicaciones.find({creador: user._id})
    .populate('estiloTatuaje', 'nombre')
    .populate('tatuado', 'userName')
    .populate('creador', 'userName')
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
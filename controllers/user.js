const User = require('../model/user.model');
const _ = require( 'lodash');
const formidable = require ('formidable');
const fs = require ('fs');
const bcrypt = require ('bcryptjs');

exports.buscarPorId = (req, res, next, id) =>{
    
    User.findById(id)
    .populate('region', 'nombre')
    .populate('comentarios', 'usuario')
    .populate('likes', 'userName')
    .populate( {path: 'comentarios', populate: {path: 'usuario', select: 'userName'}})
    .populate( {path: 'comentarios', populate: { path: 'usuario', select: 'userName'}, populate: {path:'respuesta', populate: {path: 'usuario', select: 'userName'}}})
    .exec((err, user) => {

        if(err || !user) {
            return res.status(400).json({
                error: 'Usuario no encontrado'
            })
        }
        req.profile = user;
        next();
    })
    
};

exports.buscarReservador = (req, res, next, id) =>{
    
    User.findById(id)
    .select('_id')
    .exec((err, reservador) => {

        if(err || !reservador) {
            return res.status(400).json({
                error: 'Usuario no encontrado'
            })
        }
        req.reservador = reservador;
        next();
    })
    
};

exports.buscarUserComentario = (req, res, next, id) =>{
    
    User.findById(id)
    .populate('region', 'nombre')
    .exec((err, user) => {

        if(err || !user) {
            return res.status(400).json({
                error: 'Usuario no encontrado o no esta logeado!'
            })
        }
        req.profile2 = user;
        
        next();
    })
    
};

exports.hacerComentario = (req, res) => {
    
    const usuario = req.profile
    const usuarioComentado = req.profile2
    if(!req.body.comentario ){
        return res.json({
            error: 'Debes ingresar texto en tus comentarios'
        })
    }
    User.updateOne({ _id: usuarioComentado._id}, 
    {
        $push: { 
        comentarios: {comentario: req.body.comentario, usuario: usuario._id}
    }
    }
    ).populate('comentarios._id')
    .exec( (err, result) => {
        if(err){
            return res.status(400).json({error : 'Ha ocurrido un error'})
        }else{
            res.json({
                mensaje: `Comentario agregado a ${usuarioComentado.userName}!`,
                
            })
        }
    })  
    
}
exports.eliminarComentario = (req, res) => {
    const usuario = req.profile
    const usuarioComentado = req.profile2
    
    // duño del perfil                              ||         dueño del comentario
    if(usuario._id.equals(usuarioComentado._id) || usuario._id.equals(req.body.idUser)){

        User.updateOne(
            { '_id': usuarioComentado._id},
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

exports.respuestaComentario = (req, res) => {
    const usuario = req.profile
    const usuarioComentado = req.profile2
    //REVISAR SI LOS CAMPOS INCLUYEN DATOS
    if(!req.body.respuesta || !req.body.id){
        return res.json({
            error: 'No puedes enviar comentarios sin texto!'
        })
    }

    //SE RECIBEN DESDE LOS PARAMETROS LA ID DEL USUARIO EN EL QUE ESTA EL COMENTARIO Y SE INGRESA LA RESPUESTA
    //AL COMENTARIO EN CUESTIÓN
    User.updateOne(
        { '_id': usuarioComentado._id, 'comentarios._id': req.body.id },
        {
            //INGRESA LA RESPUESTA AL COMENTARIO AL QUE SE LE ESTA RESPONDIENDO !!
            $push: { 
                'comentarios.$.respuesta': 
                {
                    respuesta: req.body.respuesta, 
                    usuario: usuario._id
                }
        }
        })
        .populate('comentarios._id')
        .exec( (err) => {
            if(err){
                return res.status(400).json({error : err})
            }else{
                res.json({
                    mensaje: `Comentario agregado con exito a ${usuarioComentado.userName}`,
                    
                })
            }
        }) 
    
}

exports.eliminarRespuesta = (req, res) => {
    const usuario = req.profile
    const usuarioComentado = req.profile2
    if(usuarioComentado._id.equals(usuario._id) || usuario._id.equals(req.body.idUser)){
        
        User.updateOne(
            { '_id': usuarioComentado._id, 'comentarios._id': req.body.idComentario },
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
exports.modificarUser = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'No se pudo cargar imagen'
            })
        }
    
        let user = req.profile
        user = _.extend(user, fields)
        // 1kb = 1000b
        // 1mb = 1000000b

        const {password, email} = fields

        if(files.img){
            //Tamaño mayor a 1mb 
            if(files.img.size > 1000000){
                return res.status(400).json({
                    error: 'La imagen no puede superar 1mb en tamaño'
                })
            }
            
            user.img.data = fs.readFileSync(files.img.path);
            user.img.contentType = files.img.type;
            
        }
        if(email){
            const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|@gmail.cl|@hotmail.cl|@inacapmail.cl|@outlook.com|@outlook.cl|@icloud.com/
            if(!emailRegex.test(email)) return res.json({error: 'Debe ingresar un email valido'})
        }

        if(password){
            if(password.length < 6 ) {
                return res.status(400).json({
                error: 'Contraseña debe tener al menos 6 carácteres!'
            })
            }else{
                user.password = bcrypt.hashSync(fields.password);
            }
        }

        user.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: 'Ha ocurrido un error'
                });
            }
            const dataUser = { 
                id: result._id,
                user: result.userName,
                tipo: result.tipo,
                nombre : result.nombre,
                email : result.email,
                membresia: result.membresia,
                img: result.img
            };
            res.json({dataUser});
               
        })
    });
    
}
    
    exports.buscarPorNombre = (req, res) => {
        if(!req.body.user || req.body.user == '') {
            return res.status(400).json({
                error: 'Debe ingresar al menos un cáracter'
            })
        }
        
        User.find({userName: {$regex: req.body.user, $options: '$i'}})
        .select('userName _id')
        .exec((err, users) => {
            if(err || !users){
                res.status(400).json({
                    error: 'Usuario no encontrado'
                })
            }
            res.json(
                {users}
            )
        }) 
    }

exports.img = (req, res, next) => {
    if(req.profile.img.contentType == null){
        return res.json({error: 'No se pudo cargar tú imagen o no existe!'})
    }
    
    if(req.profile.img.data){
        res.set('Content-Type', req.profile.img.contentType)
        
        return res.send(req.profile.img.data)
    }
    
    next()
}

exports.likePerfil = async (req, res) => {
    
    try{
        const user = await User.findById(req.body.idUser)
    if( !user.likes.includes(req.profile._id)){
        await user.updateOne({$push: {likes: req.profile._id}})
        res.json({
            mensaje: 'like'
        })
    } else {
        await user.updateOne({$pull: {likes: req.profile._id}})
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

exports.listadoUsuarios = (req, res) => {

    User.find()
    .select('nombre userName apellido tipo img')
    .exec((err, result) => {
        if(err || !result){
            return res.status(400).json({
                error: 'Usuarios no encontrados'
            })
        }

        return res.json({
            result
        })
    })
}

exports.hacerVip = (req, res) => {

    User.findByIdAndUpdate(req.profile._id,{
        membresia: true
        }).exec((err, result) => {
        if(err || !result){
            return res.status(400).json({
                error: 'Error en servidor'
            })
        }
        return res.status(200).json({
            mensaje: 'Ahora eres un usuario vip, vuelve a iniciar sesión.'
        })
    })
}
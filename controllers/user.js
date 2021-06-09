const User = require('../model/user.model');
const _ = require( 'lodash');
const formidable = require ('formidable');
const fs = require ('fs');
const bcrypt = require ('bcryptjs');

exports.buscarPorId = (req, res, next, id) =>{
    
    User.findById(id)
    .populate('region', 'nombre')
    .populate('comentarios', 'usuario')
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
    const usuario2 = req.profile2
    if(!req.body.comentario ){
        return res.json({
            error: 'Debes ingresar texto en tus comentarios'
        })
    }
    User.updateOne({ _id: usuario._id}, 
    {
        $push: { 
        comentarios: {comentario: req.body.comentario, usuario: usuario2._id}
    }
    }
    ).populate('comentarios._id')
    .exec( (err, result) => {
        if(err){
            return res.status(400).json({error : 'Ha ocurrido un error'})
        }else{
            res.json({
                mensaje: `Comentario agregado a ${usuario.userName}!`,
                
            })
        }
    })  
    
}

exports.respuestaComentario = (req, res) => {
    const usuario = req.profile
    const usuarioComenta = req.profile2
    //REVISAR SI LOS CAMPOS INCLUYEN DATOS
    if(!req.body.respuesta || !req.body.id){
        return res.json({
            error: 'No puedes enviar comentarios sin texto!'
        })
    }

    //SE RECIBEN DESDE LOS PARAMETROS LA ID DEL USUARIO EN EL QUE ESTA EL COMENTARIO Y SE INGRESA LA RESPUESTA
    //AL COMENTARIO EN CUESTIÓN
    User.updateOne(
        { '_id': usuario._id, 'comentarios._id': req.body.id },
        {
            //INGRESA LA RESPUESTA AL COMENTARIO AL QUE SE LE ESTA RESPONDIENDO !!
            $push: { 
                'comentarios.$.respuesta': 
                {
                    respuesta: req.body.respuesta, 
                    usuario: usuarioComenta._id
                }
        }
        })
        .populate('comentarios._id')
        .exec( (err) => {
            if(err){
                return res.status(400).json({error : err})
            }else{
                res.json({
                    mensaje: `Comentario agregado con exito a ${usuario.userName}`,
                    
                })
            }
        }) 
    
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

        const {userName,nombre, apellido, email, edad, password} = fields
        if(!userName || !nombre || !apellido || !email || !edad || !password){
            return res.status(400).json({
                error: 'Debe rellenar todos los campos Obligatorios!'
            })
        }
        if(password.length < 6 ) {
            return res.status(400).json({
                error: 'Contraseña debe tener al menos 6 carácteres!'
            })
        }

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
        user.password = bcrypt.hashSync(fields.password);
        user.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: 'Ha ocurrido un error'
                });
            }
            
            res.json({result});
               
        })
    });
    
}


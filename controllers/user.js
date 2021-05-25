const User = require('../model/user.model');
const _ = require( 'lodash');
const formidable = require ('formidable');
const fs = require ('fs');
const bcrypt = require ('bcryptjs');

exports.buscarPorId = (req, res, next, id) =>{
    
    User.findById(id)
    .populate('region', 'nombre')
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

        const {nombre, apellido, email, edad, password} = fields
        if(!nombre || !apellido || !email || !edad || !password){
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
            user.password = bcrypt.hashSync(fields.password);
        }
        
        user.save((err, result) => {
        
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            
            res.json({result});
               
        })
    });
    
}


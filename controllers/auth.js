const User = require ('../model/user.model');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const SECRET_KEY = 'secretkey1234567';
const formidable = require ('formidable');
const fs = require ('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createUser = (req, res, next ) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, files) => {


        if(err){
            return res.status(400).json({
                error: 'No se pudo cargar imagen'
            })
        }
        
        let user = new User (fields)

        // 1kb = 1000b
        // 1mb = 1000000b

        const {userName, nombre, apellido, email, edad, password} = fields
        if(edad < 18 || edad >100) {
            return res.status(400).json({
                error: 'Debes se mayor de edad'
            })
        }
        const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|@gmail.cl|@hotmail.cl|@inacapmail.cl|@outlook.com|@outlook.cl|@icloud.com/
        if(!emailRegex.test(email)) return res.json({error: 'Debe ingresar un email valido'})
        
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
                    error: 'Ha ocurrido un error inesperado'
                });
            }
            
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign(
                { 
                    id: user.id 
                }, 
                SECRET_KEY, 
                {
                    expiresIn: expiresIn
                });
            const dataUser = { 
                    id: result._id,
                    user: result.userName,
                    tipo: result.tipo,
                    nombre : result.nombre,
                    email : result.email,
                    membresia: result.membresia,
                    likes: result.likes,
                    img: result.img
            };
            res.json({dataUser, accessToken});
               
        })
    });
}

exports.loginUser = (req,res, next) => {

    
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne ({email: userData.email}, (err, user) =>{

        if(err) return res.status(500).send({error: 'Server error!'});

        if(!user) {
            // Email no existe
            res.status(409).send({error: 'Usuario o contraseña incorrecta'});
        }  else{
            
            //Comparacion password encriptadas
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            
            if(resultPassword){
                const expiresIn = 24*60*60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY );
                res.cookie('t', accessToken, {expire: expiresIn})
                const dataUser = { 
                    id: user._id,
                    user: user.userName,
                    tipo: user.tipo,
                    nombre : user.nombre,
                    email : user.email,
                    membresia: user.membresia,
                    img: user.img
                };
                return res.json ({accessToken, dataUser })
                
            } else{
            // password wrong
              res.status(409).json({error: 'Usuario o contraseña incorrecta'});
              
            }
        }
    });
}

exports.deslogeo = (req, res, next) => {
    res.clearCookie("key");
    res.json({mensaje: "Deslogeado con exito! "});
}

// EVALUA QUE EL USUARIO ESTE LOGEADO
exports.requiereLogeo = (req, res, next) => {
   
    const token = req.headers.authorization;
    
    if (token) {
        
      jwt.verify(token, SECRET_KEY, (err, user) => {     
          
        if (err) {
          return res.json({ error: 'Oops! error en token' });    
        } else {
          
          req.user = user.id;   
          
          next();
        }
      });
    } else {
      res.send({ 
          error: 'Necesita estar logeado' 
      });
    }
 };

// ISAUTH EVALUA SI EL USUARIO ESTA AUTORIZADO A ENTRAR, EJ. USUARIO/MODIFICARPERFIL TIENE QUE SER UN USUARIO O UN ADMIN 
exports.isAuth = (req, res, next) =>{
    
    let user = req.profile && req.profile._id == req.user 
    
    if(!user){
         return res.status(403).json({
             error: 'Perfil no corresponde a usuario!'
         })
     }
     next();

 }

 exports.isAuthPublicaciones = (req, res, next) =>{
    
    const publicacion = req.publicacion
    const user = req.profile
    
     if(user._id.equals(publicacion.creador._id) || user.tipo == 0){
         next();
     }
     else{
         return res.status(200).json({
             error: 'No tienes permisos para realizar esta acción'
         })
     }

 }

 exports.isAuthProyecto = (req, res, next) =>{
    
    const proyecto = req.proyecto
    const user = req.profile
    
     if(user._id.equals(proyecto.creador._id) || user.tipo == 0){
         next();
     }
     else{
         return res.status(200).json({
             error: 'No tienes permisos para realizar esta acción'
         })
     }

 }

 // EVALUA SI USUARIO ES ADMINISTRADOR
 exports.isAdmin = (req,res, next) => {

     if(req.profile.tipo === 1 || req.profile.tipo === 2) {
         return res.status(403).json({
             error: 'Recurso de administrador, acceso denegado'
         });
     }
     next();

 }

exports.isAuthOferta = (req, res, next) => {
    const proyecto = req.proyecto
    const usuario = req.profile
    if(proyecto.creador._id.equals(usuario._id))
    {
        return res.json({
            error: 'No puedes realizar ofertas a tus propios proyectos!'
        })
    }else{
        next();
    }
     
}

exports.isAuthOfertaCreador = (req, res, next) => {
    const oferta = req.oferta
    const usuario = req.profile
    if(oferta.ofertante.equals(usuario._id) || usuario.tipo == 0)
    {
        next();
    }else{
        return res.json({
            error: 'No tienes los permisos necesarios!'
        })
    }
     
}

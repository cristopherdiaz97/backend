const User = require ('./auth.dao');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const { response } = require('express');
const SECRET_KEY = 'secretkey1234567';

exports.createUser = (req, res, next ) => {
    
    
    const newUser = {
        nombre : req.body.nombre,
        apellido : req.body.apellido,
        edad: req.body.edad,
        sexo: req.body.sexo,
        email: req.body.email,
        password : bcrypt.hashSync(req.body.password),
        tipo: req.body.tipo
        
    }
    
    
    User.create (newUser, (err, user) => {
        
        if(err && err.code === 11000){
            return res.status(409).send('El correo ya existe');
        } 
        
        if(err) return res.status(500).send('Server error 500');

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
            nombre: user.name,
            apellido: user.apellido,
            edad: user.edad,
            sexo: user.sexo,
            email: user.email,
            password: user.password,
            tipo: user.tipo,
            accessToken: accessToken,
            expiresIn: expiresIn
            
        }
            //response
            res.send({dataUser});
            
    } );
    
}

exports.loginUser = (req,res, next) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }
    User.findOne ({email: userData.email}, (err, user) =>{
        if(err) return req.status(500).send('Server error!');
        if(!user) {
            // email doesn't exist
            res.status(409).send({message: 'Usuario o contraseña incorrecta'});
        }  else{
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if(resultPassword){
                const expiresIn = 24*60*60;
                const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {expiresIn: expiresIn});
                const dataUser = { 
                    name : user.name,
                    email : user.email,
                    accessToken : accessToken,
                    expiresIn : expiresIn
                };
                res.send({dataUser});
            } else{
                // password wrong
              res.status(409).send({message: 'Usuario o contraseña incorrecta'});
            }
        }
    });
}


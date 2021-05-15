const User = require('../model/user.model');

exports.buscarPorId = (req, res, next, id) =>{
    User.findById(id).exec((err, user)=> {
        if(err || !user) {
            return res.status(400).json({
                error: 'Usuario no encontrado'
            })
        }
        req.profile = user;
        next();  
    })
};
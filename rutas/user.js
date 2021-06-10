const express = require('express');
const router = express.Router();

const {buscarPorId, buscarUserComentario, modificarUser, hacerComentario, respuestaComentario, buscarPorNombre, seguirUsuario} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

router.get('/perfil/buscar/:userId', requiereLogeo, isAuth, (req,res ) => {
    
    res.json({
        user: req.profile,
       
    });
})
router.put('/perfil/modificar/:userId', requiereLogeo, isAuth, modificarUser)
router.put('/perfil/comentario/:userId/:userIdComentando', requiereLogeo, isAuth, hacerComentario);
router.put('/perfil/comentario/respuesta/:userId/:userIdComentando', requiereLogeo, isAuth, respuestaComentario);
router.get('/perfil/buscar', buscarPorNombre)

//Cada vez que se utilice el parametro userId en la ruta, se ejecutara busacar por id.
router.param('userId', buscarPorId); 
router.param('userIdComentando', buscarUserComentario); 


module.exports = router;
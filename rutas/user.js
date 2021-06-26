const express = require('express');
const router = express.Router();

const {buscarPorId, buscarUserComentario, modificarUser, hacerComentario, respuestaComentario, buscarPorNombre, img, likePerfil, eliminarComentario, eliminarRespuesta, listadoUsuarios} = require ('../controllers/user');
const { requiereLogeo, isAuth } = require ('../controllers/auth');

router.get('/perfil/buscar/:userId', (req, res) => {
    res.json({
        user: req.profile
    })
})
router.put('/perfil/modificar/:userId', requiereLogeo, isAuth, modificarUser)
router.put('/perfil/comentario/:userId/:userIdComentado', requiereLogeo, isAuth, hacerComentario);
router.put('/perfil/comentario/eliminar/:userId/:userIdComentado', requiereLogeo, isAuth, eliminarComentario);
router.put('/perfil/comentario/respuesta/:userId/:userIdComentado', requiereLogeo, isAuth, respuestaComentario);
router.put('/perfil/comentario/respuesta/eliminar/:userId/:userIdComentado', requiereLogeo, isAuth, eliminarRespuesta);
router.post('/perfil/buscar', buscarPorNombre)
router.get('/perfil/imagen/:userId', img)
router.put('/perfil/like/:userId', requiereLogeo, isAuth, likePerfil)
router.get('/perfil/listado/:userId', requiereLogeo, isAuth, listadoUsuarios)

//Cada vez que se utilice el parametro userId en la ruta, se ejecutara busacar por id.
router.param('userId', buscarPorId); 
router.param('userIdComentado', buscarUserComentario); 


module.exports = router;
const express = require('express');
const router = express.Router();

const {create, publicacionPorId, buscar, eliminar, modificar, 
    listaPublicaciones, hacerComentario, respuestaComentario, likePublicacion,
    listaPublicacionesUsuarios, img
    } = require ('../controllers/publicaciones');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAuthPublicaciones } = require ('../controllers/auth');


router.get('/inicio/buscar/:publicacionId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/publicacion/eliminar/:publicacionId/:userId', requiereLogeo, isAuth, isAuthPublicaciones, eliminar);
router.put('/publicacion/modificar/:publicacionId/:userId', requiereLogeo, isAuth, isAuthPublicaciones, modificar);
router.post('/publicacion/crear/:userId', requiereLogeo, isAuth, create);
router.get('/inicio/', listaPublicaciones);
router.put('/publicacion/comentario/:publicacionId/:userId', requiereLogeo, isAuth, hacerComentario);
router.put('/publicacion/comentario/respuesta/:publicacionId/:userId', requiereLogeo, isAuth, respuestaComentario);
router.get('/publicacion/misPublicaciones/:userId', requiereLogeo, isAuth, listaPublicacionesUsuarios);
router.put('/publicacion/like/:userId', requiereLogeo, isAuth, likePublicacion)
router.get('/publicacion/imagen/:publicacionId', img)

router.param('userId', buscarPorId);
router.param('publicacionId', publicacionPorId);
module.exports = router;   
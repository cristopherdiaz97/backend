const express = require('express');
const router = express.Router();

const {create, publicacionPorId, buscar, eliminar, modificar, 
    listaPublicaciones, hacerComentario, respuestaComentario, likePublicacion} = require ('../controllers/publicaciones');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');


router.get('/inicio/buscar/:publicacionId/:userId', requiereLogeo, isAuth, isAdmin, buscar);
router.delete('/publicacion/eliminar/:publicacionId/:userId', requiereLogeo, isAuth, eliminar);
router.put('/publicacion/modificar/:publicacionId/:userId', requiereLogeo, isAuth, isAdmin, modificar);
router.post('/publicacion/crear/:userId', requiereLogeo, isAuth, isAdmin, create);
router.get('/inicio/publicaciones/:userId', requiereLogeo, listaPublicaciones);
router.put('/publicacion/comentario/:publicacionId/:userId', requiereLogeo, hacerComentario);
router.put('/publicacion/comentario/respuesta/:publicacionId/:userId', requiereLogeo, respuestaComentario);
router.post('/publicacion/likes/:publicacionId/:userId', requiereLogeo, likePublicacion)

router.param('userId', buscarPorId);
router.param('publicacionId', publicacionPorId);
module.exports = router;   
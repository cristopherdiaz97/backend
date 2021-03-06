const express = require('express');
const router = express.Router();

const {create, publicacionPorId, buscar, eliminar, modificar, 
    listaPublicaciones, hacerComentario, respuestaComentario, likePublicacion,
    listaPublicacionesUsuarios, img, eliminarComentario, eliminarRespuesta, listaPublicacionesBusqueda
    } = require ('../controllers/publicaciones');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAuthPublicaciones } = require ('../controllers/auth');


router.get('/inicio/buscar/:publicacionId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/publicacion/eliminar/:publicacionId/:userId', requiereLogeo, isAuth, isAuthPublicaciones, eliminar);
router.put('/publicacion/modificar/:publicacionId/:userId', requiereLogeo, isAuth, isAuthPublicaciones, modificar);
router.post('/publicacion/crear/:userId', requiereLogeo, isAuth, create);
router.get('/inicio/', listaPublicaciones);
router.post('/inicio/busqueda', listaPublicacionesBusqueda);
router.put('/publicacion/comentario/:publicacionId/:userId', requiereLogeo, isAuth, hacerComentario);
router.put('/publicacion/comentario/eliminar/:publicacionId/:userId', requiereLogeo, isAuth, eliminarComentario);
router.put('/publicacion/comentario/respuesta/:publicacionId/:userId', requiereLogeo, isAuth, respuestaComentario);
router.put('/publicacion/comentario/respuesta/eliminar/:publicacionId/:userId', requiereLogeo, isAuth, eliminarRespuesta);
router.get('/publicacion/misPublicaciones/:userId', requiereLogeo, listaPublicacionesUsuarios);
router.put('/publicacion/like/:userId', requiereLogeo, isAuth, likePublicacion)
router.get('/publicacion/imagen/:publicacionId', img)

router.param('userId', buscarPorId);
router.param('publicacionId', publicacionPorId);
module.exports = router;   
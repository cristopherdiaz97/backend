const express = require('express');
const router = express.Router();

const {create, modificar, buscar, eliminar, listaProyectos, ofertaPorId, respuestaOferta} = require ('../controllers/ofertas');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth } = require ('../controllers/auth');
const {proyectoPorId} = require ('../controllers/proyecto.js');
 
//RUTAS
router.put('/oferta/crear/:proyectoId/:userId',requiereLogeo, isAuth, create);
router.put('/oferta/modificar/:ofertaId/:userId', requiereLogeo, isAuth, modificar);
// router.get('/oferta/buscar/:proyectoId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/oferta/eliminar/:ofertaId/:userId', requiereLogeo, isAuth, eliminar);
router.put('/oferta/respuesta/:proyectoId/:ofertaId/:userId', requiereLogeo, isAuth, respuestaOferta);

router.param('proyectoId', proyectoPorId);
router.param('userId', buscarPorId);
router.param('ofertaId', ofertaPorId);

module.exports = router;
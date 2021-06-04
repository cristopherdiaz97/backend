const express = require('express');
const router = express.Router();

const {create, modificar, eliminar,  buscar, ofertaPorId, respuestaOferta, listadoOfertas} = require ('../controllers/ofertas');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAuthOferta, isAuthOfertaCreador, isAuthProyecto } = require ('../controllers/auth');
const {proyectoPorId} = require ('../controllers/proyecto.js');
 
//RUTAS
router.put('/oferta/crear/:proyectoId/:userId',requiereLogeo, isAuth, isAuthOferta, create);
router.put('/oferta/modificar/:ofertaId/:userId', requiereLogeo, isAuthOfertaCreador, isAuth, modificar);
router.get('/oferta/buscar/:proyectoId/:ofertaId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/oferta/eliminar/:ofertaId/:userId', requiereLogeo, isAuthOfertaCreador, isAuth, eliminar);
router.put('/oferta/respuesta/:proyectoId/:ofertaId/:userId', requiereLogeo, isAuth, isAuthProyecto, respuestaOferta);
router.get('/oferta/misOfertas/:userId', requiereLogeo, isAuth, listadoOfertas);

router.param('proyectoId', proyectoPorId);
router.param('userId', buscarPorId);
router.param('ofertaId', ofertaPorId);

module.exports = router;
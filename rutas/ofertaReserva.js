const express = require('express');
const router = express.Router();

const { create, eliminar,  buscar, ofertaPorId, respuestaOferta, listaOfertas} = require ('../controllers/ofertaReserva');
const { buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth } = require ('../controllers/auth');
const { reservaPorId } = require('../controllers/reserva')
 
//RUTAS
router.put('/oferta-hora/crear/:userId', requiereLogeo, isAuth, create);
// router.get('/oferta-hora/buscar/:ofertaId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/oferta-hora/eliminar/:ofertaId/:userId', requiereLogeo, isAuth, eliminar);
router.get('/oferta-hora/misofertas/:userId', requiereLogeo, listaOfertas);
router.put('/oferta-hora/respuesta/:reservaId/:ofertaId/:userId', requiereLogeo, isAuth, respuestaOferta);

router.param('userId', buscarPorId);
router.param('ofertaId', ofertaPorId)
router.param('reservaId', reservaPorId)
module.exports = router;
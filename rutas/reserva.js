const express = require('express');
const router = express.Router();

const { create, modificar, eliminar,  buscar, reservaPorId, listaHorasUsuarios, miAgenda, listaAgenda} = require ('../controllers/reserva');
const { buscarPorId } = require ('../controllers/user');
const { requiereLogeo, isAuth } = require ('../controllers/auth');
 
//RUTAS
router.post('/reserva/crear/:userId', requiereLogeo, isAuth, create);
router.put('/reserva/modificar/:userId/:reservaId', requiereLogeo, isAuth, modificar);
router.get('/reserva/buscar/:userId/:reservaId', requiereLogeo, isAuth, buscar);
router.delete('/reserva/eliminar/:userId/:reservaId', requiereLogeo, isAuth, eliminar);
//TODAS LAS OFERTAS DE UNA RESERVA SELECCIONADA
router.post('/reserva/listado/ofertas/:userId', requiereLogeo, listaHorasUsuarios);
// TODAS LAS HORAS AGENDADAS (FECHA, ESTADO, OFERTANTE)
router.get('/reserva/miagenda/:userId', requiereLogeo, isAuth, miAgenda)
router.post('/reserva/agenda/:userId', requiereLogeo, listaAgenda)

router.param('userId', buscarPorId);
router.param('reservaId', reservaPorId)

module.exports = router;

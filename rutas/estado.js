const express = require('express');
const router = express.Router();

const {create, modificar, estadoPorId, buscar, eliminar, listaEstados} = require ('../controllers/estado');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

//RUTAS ESTADOS
router.post('/estado/crear/:userId', requiereLogeo, isAuth, isAdmin, create);
router.put('/estado/modificar/:estadoId/:userId', requiereLogeo, isAuth, isAdmin, modificar);
router.get('/estado/buscar/:estadoId/:userId', requiereLogeo, isAuth, isAdmin, buscar);
router.delete('/estado/eliminar/:estadoId/:userId', requiereLogeo, isAuth, isAdmin, eliminar);
router.get('/estado/listado/:userId', requiereLogeo, isAuth, listaEstados)
router.param('userId', buscarPorId);
router.param('estadoId', estadoPorId);

module.exports = router;    

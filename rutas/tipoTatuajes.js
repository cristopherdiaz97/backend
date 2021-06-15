const express = require('express');
const router = express.Router();

const {create, modificar, buscar, eliminar, listaTipoTatuajes, tipoTatuajePorId} = require ('../controllers/tipoTatuajes');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

router.post('/tiposTatuajes/crear/:userId', requiereLogeo, isAuth, isAdmin, create);
router.put('/tipoTatuajes/modificar/:tipoTatuajeId/:userId', requiereLogeo, isAuth, isAdmin, modificar);
router.get('/tipoTatuajes/buscar/:tipoTatuajeId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/tipoTatuajes/eliminar/:tipoTatuajeId/:userId', requiereLogeo, isAuth, isAdmin, eliminar);
router.get('/tipoTatuajes/listado/:userId', requiereLogeo, isAuth, listaTipoTatuajes)

router.param('userId', buscarPorId);
router.param('tipoTatuajeId', tipoTatuajePorId);

module.exports = router;    

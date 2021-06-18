const express = require('express');
const router = express.Router();

const {create, partePorId, buscar, eliminar, modificar, listaPartes} = require ('../controllers/parteCuerpo');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');


router.get('/parte/buscar/:parteId/:userId', requiereLogeo, isAuth, isAdmin, buscar);
router.delete('/parte/eliminar/:parteId/:userId', requiereLogeo, isAuth, isAdmin, eliminar);
router.put('/parte/modificar/:parteId/:userId', requiereLogeo, isAuth, isAdmin, modificar);
router.post('/parte/crear/:userId', requiereLogeo, isAuth, isAdmin, create);
router.get('/parte/listado',  listaPartes);


router.param('userId', buscarPorId);
router.param('parteId', partePorId);

module.exports = router;    
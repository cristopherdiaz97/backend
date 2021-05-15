const express = require('express');
const router = express.Router();
const {create} = require ('../controllers/tipoTatuajes');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

router.post('/tiposTatuajes/crear/:userId', requiereLogeo, isAuth, isAdmin, create);

//Cada vez que se utilice el parametro userId en la ruta, se ejecutara busacar por id.
router.param('userId', buscarPorId);

module.exports = router;
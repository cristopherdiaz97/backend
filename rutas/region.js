const express = require('express');
const router = express.Router();
const {create} = require ('../controllers/region');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

//RUTAS REGIONES
router.post('/region/crear/:userId', requiereLogeo, isAuth, isAdmin, create);

router.param('userId', buscarPorId);

module.exports = router;    



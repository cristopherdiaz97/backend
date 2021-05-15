const express = require('express');
const router = express.Router();
const {create} = require ('../controllers/estado');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

//RUTAS ESTADOS
router.post('/estado/crear/:userId', requiereLogeo, isAuth, isAdmin, create);

router.param('userId', buscarPorId);

module.exports = router;    

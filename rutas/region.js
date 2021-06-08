const express = require('express');
const router = express.Router();

const {create, regionPorId, buscar, eliminar, modificar, listaRegiones} = require ('../controllers/region');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');


router.get('/region/buscar/:regionId/:userId', requiereLogeo, isAuth, isAdmin, buscar);
router.delete('/region/eliminar/:regionId/:userId', requiereLogeo, isAuth, isAdmin, eliminar);
router.put('/region/modificar/:regionId/:userId', requiereLogeo, isAuth, isAdmin, modificar);
router.post('/region/crear/:userId', requiereLogeo, isAuth, isAdmin, create);
router.get('/region/listado',  listaRegiones);


router.param('userId', buscarPorId);
router.param('regionId', regionPorId);

module.exports = router;    



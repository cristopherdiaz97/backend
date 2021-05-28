const express = require('express');
const router = express.Router();

const {create, modificar, buscar, eliminar, listaProyectos, proyectoPorId} = require ('../controllers/proyecto');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth } = require ('../controllers/auth');

//RUTAS ESTADOS
router.post('/proyecto/crear/:userId', requiereLogeo, isAuth, create);
router.put('/proyecto/modificar/:proyectoId/:userId', requiereLogeo, isAuth, modificar);
router.get('/proyecto/buscar/:proyectoId/:userId', requiereLogeo, isAuth, buscar);
router.delete('/proyecto/eliminar/:proyectoId/:userId', requiereLogeo, isAuth, eliminar);
router.get('/proyecto/listado/:userId', requiereLogeo, listaProyectos);

router.param('userId', buscarPorId);
router.param('proyectoId', proyectoPorId);

module.exports = router;    

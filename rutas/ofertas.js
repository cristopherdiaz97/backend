const express = require('express');
const router = express.Router();

const {create, modificar, buscar, eliminar, listaProyectos, ofertaPorId} = require ('../controllers/ofertas');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth } = require ('../controllers/auth');
const {proyectoPorId} = require ('../controllers/proyecto.js');
 
//RUTAS
router.put('/oferta/crear/:proyectoId/:userId',requiereLogeo, isAuth, create);
// router.put('/oferta/modificar/:proyectoId/:userId', requiereLogeo, isAuth, modificar);
// router.get('/oferta/buscar/:proyectoId/:userId', requiereLogeo, isAuth, buscar);
// router.delete('/oferta/eliminar/:proyectoId/:userId', requiereLogeo, isAuth, eliminar);
// router.get('/oferta/listado/:userId', requiereLogeo, listaProyectos);

router.param('proyectoId', proyectoPorId);
router.param('userId', buscarPorId);

module.exports = router;
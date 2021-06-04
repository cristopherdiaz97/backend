const express = require('express');
const router = express.Router();

const {create, modificar, buscar, eliminar, listaProyectos, proyectoPorId, listaProyectosUsuarios} = require ('../controllers/proyecto');
const {buscarPorId} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAuthProyecto } = require ('../controllers/auth');

//RUTAS ESTADOS
router.post('/proyecto/crear/:userId', requiereLogeo, isAuth, create);
router.put('/proyecto/modificar/:proyectoId/:userId', requiereLogeo, isAuth, isAuthProyecto, modificar);
router.get('/proyecto/buscar/:proyectoId/:userId', requiereLogeo, isAuth, isAuthProyecto, buscar);
router.delete('/proyecto/eliminar/:proyectoId/:userId', requiereLogeo, isAuth, isAuthProyecto, eliminar);
router.get('/proyecto/listado/:userId', requiereLogeo, listaProyectos);
router.get('/proyecto/misProyectos/:userId', requiereLogeo, listaProyectosUsuarios);


router.param('userId', buscarPorId);
router.param('proyectoId', proyectoPorId);

module.exports = router;    

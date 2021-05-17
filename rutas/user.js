const express = require('express');
const router = express.Router();

const {buscarPorId, modificarUser} = require ('../controllers/user');
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');

router.get('/perfil/buscar/:userId', requiereLogeo, isAuth, isAdmin, (req,res ) => {
    res.json({
        user: req.profile
       
    });
})
router.put('/perfil/modificar/:userId', requiereLogeo, isAuth, modificarUser)

//Cada vez que se utilice el parametro userId en la ruta, se ejecutara busacar por id.
router.param('userId', buscarPorId); 

module.exports = router;
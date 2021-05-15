const express = require('express');
const router = express.Router();
const {createUser, loginUser, deslogeo, requiereLogeo} = require ('../controllers/auth');



//RUTAS POST REGISTRO 
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/deslogeo', deslogeo);

router.get('/hola', requiereLogeo, (req, res) =>{
    res.send("holaaa");
});



module.exports = router;





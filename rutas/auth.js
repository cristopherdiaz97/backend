const express = require('express');
const router = express.Router();

const {createUser, loginUser, deslogeo} = require ('../controllers/auth');



//RUTAS POST REGISTRO 
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/deslogeo', deslogeo);




module.exports = router;





const router = require ('express').Router()
const {getAllChatrooms, createChatroom, deleteChatroom, buscarChatroom} = require ('../controllers/chatroomController')
const { requiereLogeo, isAuth, isAdmin } = require ('../controllers/auth');
const {buscarPorId} = require ('../controllers/user');

router.get('/chatroom/:userId', requiereLogeo, isAuth, getAllChatrooms)
router.post('/chatroom/crear/:userId', requiereLogeo, isAuth, isAdmin, createChatroom)
router.delete('/chatroom/eliminar/:idChatroom/:userId', requiereLogeo, isAuth, isAdmin, deleteChatroom)

router.param('idChatroom', buscarChatroom)
router.param('userId', buscarPorId);
module.exports = router
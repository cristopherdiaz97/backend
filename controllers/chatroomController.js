const mongoose = require('mongoose')
const User = require('../model/user.model')
const Chatroom = require('../model/chatroom.model')

exports.createChatroom = async (req, res) => {
    const user = req.profile
    await User.findOne({_id: user._id}).exec((err, user) => {
        if( user.tipo === 1 || user.tipo === 2 ){
            return res.status(400).send({error: 'No tienes permisos para crear chatrooms!'})
        }
    })
    
     
        const {name} = req.body;
        const nameRegex = /^[a-zA-Z_ !@#$%^&*)(-]*$/

        if(!nameRegex.test(name)) {
            return res.status(400).send({ error: 'Debe ingresar un nombre valido'}) 
        }
        
        const chatroomExists =  await Chatroom.findOne({name})

        if(chatroomExists) {
            return res.status(400).send({error: 'Ya existe un chatroom con este nombre'})
        }

        const chatroom = new Chatroom({
            name
        })

        await chatroom.save()

        res.json({
            mensaje: 'Chatroom creada'
        })

    
    
}

exports.getAllChatrooms =  (req, res) =>{
    
     Chatroom.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: 'No existen chatrooms aún!'
              }); 
        }    
        
        res.status(200).json(data)
    })
    
}

exports.deleteChatroom = async (req, res) => {
    
    const user = await User.findOne({_id: req.profile._id})
    
    if( user.tipo === 1 || user.tipo === 2 ){
        res.json({error: 'No tienes permisos para crear chatrooms!'})
    } else{ 
        Chatroom.findByIdAndRemove(req.chatroom)
        .exec((err, chatroomEliminada)=>{
            if(err){
                return res.status(400).json({error: 'Ha ocurrido un error'});
            }
            res.json({
                mensaje: `Chatroom: ${chatroomEliminada.name} eliminado con exito!`
            })
        }
        );
    }

    
}
exports.buscarChatroom = async (req, res, next, id) => {
    Chatroom.findById(id)
    .exec((err, chatroom) => {

        if(err || !chatroom) {
            return res.status(400).json({
                error: 'Chatroom no existe!'
            })
        }
        req.chatroom = chatroom;
        next();
    })
}
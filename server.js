'user strict' 
const cors = require ('cors');
const express = require ('express');
const DB = require ('./config/db');
const morgan =  require ('morgan');
const cookieParser = require ('cookie-parser');
require("dotenv").config();

// Aplicacion / api, permite utilizar rutas, operar con el sv etc.
const app = express();

// SOCKET.IO
const server = require('http').Server(app);

//import routes
const userRoutes = require('./rutas/user');
const authRoutes = require('./rutas/auth');
const regionRoutes = require('./rutas/region');
const estadoRoutes = require('./rutas/estado');
const tiposTatuajesRoutes = require('./rutas/tipoTatuajes');
const publicacionesRoutes = require ('./rutas/publicaciones');
const proyectoRoutes = require ('./rutas/proyecto');
const ofertaRoutes = require ('./rutas/ofertas');
const chatroomRoutes = require ('./rutas/chatroom.js')
    //Iniciar base de datos
    DB();

    //middleware 
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    //RUTAS
    app.use('/api', userRoutes);
    app.use('/api', authRoutes);
    app.use('/api', regionRoutes);
    app.use('/api', estadoRoutes);
    app.use('/api', tiposTatuajesRoutes);
    app.use('/api', publicacionesRoutes);
    app.use('/api', proyectoRoutes);
    app.use('/api', ofertaRoutes);
    app.use('/api', chatroomRoutes)
    
    app.use('/api',  (err, res) => {
        res.json({mensaje: 'Página principal Inkapp!'});
    })

    // RESCATAR PUERTO PARA SERVIDOR 
    const port =  process.env.PORT || 4000
    server.listen(port,()=>{     
        console.log(`Server is running on port ${port}`); 
    });

    const io = require('socket.io')(server, {
        cors: {
          origin: '*',
        }
      });

    //Variables entorno Socket.io
    const jwt = require ('jsonwebtoken');
    const SECRET_KEY = 'secretkey1234567';

    //Modelos para socket.io
    const User = require('./model/user.model')
    const Message = require('./model/message.model')
    
    io.use(async (socket, next) => {
        
        try{
            const token = socket.handshake.query.token
            const payload = await jwt.verify(token, SECRET_KEY)
            socket.userId = payload.id
            next()
        }catch(err){
            console.log(err);
        }
    })
    
    io.on("connection", (socket) =>{
        console.log("Connected: "  + socket.userId);
    
        socket.on("disconnect", () => {
            console.log("Disconnected: " + socket.userId);
        })
    
        socket.on('joinRoom', async ({chatroomId}) => {
            socket.join(chatroomId)
            console.log('A user joined chatroom: ' + chatroomId);
            const user = await User.findOne({_id: socket.userId})
            socket.broadcast.to(chatroomId).emit('newMessage', {message: 'Ha ingresado al chat', name: user.userName, userId: socket.userId});
            
        })
    
        socket.on('leaveRoom', async ({chatroomId}) => {
            socket.leave(chatroomId)
            const user = await User.findOne({_id: socket.userId})
            console.log('A user left chatroom: ' + chatroomId);
            socket.broadcast.to(chatroomId).emit('newMessage', {message: 'Ha abandonado el chat', name: user.userName, userId: socket.userId})
        })
    
        socket.on('chatroomMessage', async ({chatroomId, message}) => {
            if(message.trim().length > 0){
                const user = await User.findOne({_id: socket.userId})
                const newMessage = new Message({
                    chatroom: chatroomId, 
                    user: socket.userId, 
                    message: message})
    
                io.to(chatroomId).emit('newMessage', {
                    message,
                    name: user.userName,
                    userId: socket.userId,
                })
    
                await newMessage.save()
            }
           
        })
    })  
    // load env variables 
    const dotenv = require('dotenv'); 
    dotenv.config() 
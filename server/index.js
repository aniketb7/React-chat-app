const express = require('express');
const socketio = require('socket.io')
const http = require('http')
const {addUser, removeUser, getUser,getUsersInRoom}= require('./users');
const router = require('./router')
const PORT=process.env.PORT || 5000
const app = express();
const server = http.createServer(app);
// const io = socketio(server);
const io = require('socket.io')(server,
    {
        cors:{
            origin:"*"
        }
    })

io.on('connection',(socket)=>{
    socket.on('Join',({name,room},callback)=>{
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);
       //system msg
       
       socket.join(user.room);
      
       socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
       socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
   
       io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
   
       callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log("Inside sendMessage", user)
        io.to(user.room).emit('message', { user: user.name, text: message });
        callback();
      });


    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('message',{user:'admin', text:`${user.name} has left`})
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }

    })
})


app.use(router);



server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})





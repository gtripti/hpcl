//server

module.exports = function(io, Global, _){
    const clients = new Global();//calling constructor
    
    io.on('connection', (socket) => {//connecting to global connection event
       socket.on('global room', (global) => {//listening to global event
           socket.join(global.room);
          
           clients.EnterRoom(socket.id, global.name, global.room, global.img);
           
           const nameProp = clients.GetRoomList(global.room);
           //console.log(nameProp);
           const arr = _.uniqBy(nameProp, 'name');// to return unique names
           
           //console.log(arr);
           
           io.to(global.room).emit('loggedInUser', arr);// emit an event
           
       }); 
        
         socket.on('disconnect', () => {
            var user = clients.RemoveUser(socket.id);
            
            if(user){
                
                const userData = clients.GetRoomList(user.room);
           
                const arr = _.uniqBy(userData, 'name');
                const removerData = _.remove(arr, {'name': user.name});
                
                io.to(user.room).emit('loggedInUser', arr);
            }
        })
    });
}
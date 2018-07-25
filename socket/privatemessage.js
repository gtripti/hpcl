module.exports = function(io){
    
    //const users1 = new Users();
    
    io.on('connection', (socket) => {
        socket.on('join PM', (pm) => {
           socket.join(pm.room1);
            socket.join(pm.room2);
            /*users1.AddUserData(socket.id, pm.name, pm.room1);
            console.log(users1);*/
            
        });
        
        socket.on('private message', (message, callback) => {
            //console.log(message);
            io.to(message.room).emit('new message', {
                text: message.text,
                sender: message.sender
            });
            
            io.emit('message display', {
                
            });
            
            callback();
        });
        
        socket.on('refresh', function(){
           io.emit('new refresh', {}); 
        });
    });
}

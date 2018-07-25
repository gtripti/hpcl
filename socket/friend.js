//server

module.exports = function(io){
    io.on('connection', (socket) => {
       socket.on('joinRequest', (myRequest, callback) => {//listen to joinRequest
           socket.join(myRequest.sender);//from groupchat.js when user joins the room
           
           callback();
       }); 
        
        socket.on('friendRequest', (friend, callback) => {
           io.to(friend.receiver).emit('newFriendRequest', {
               from: friend.sender,
               to: friend.receiver
           }); 
            
            callback();//display acknowledgement in console
            
        });
        
    });
}
//client
$(document).ready(function(){
    var socket = io();
    
    socket.on('connect', function(){//listening to global connect method
        
        var room = 'GlobalRoom';//hardcoded
        var name = $('#name-user').val();//user from home page
        var img = $('#name-image').val();//image from home page
        
        socket.emit('global room', {//emit the event
            room: room,
            name: name,
            img: img
        });
        
        socket.on('message display', function(){
           $('#reload').load(location.href + ' #reload'); 
        });
        
    });
    
    socket.on('loggedInUser', function(users){//listening to the event  
        //var friends = $('.friend').text();//getting value from div
        //var friend = friends.split('@');
        
        var name = $('#name-user').val().toLowerCase();//logged in user
        var ol = $('<div></div');
        var arr = [];
        
        for(var i=0; i< users.length; i++){//1 from copy
            //if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                
                var userName = users[i].name.toLowerCase(); 
                
                /*var list = '<img src="https://placehold.it/300x300" class="pull-left img-circle" style="width:50px; margin-right:10px;" /><p>' + 
                '<a id="val" href="/chat/'+userName.replace(/ /g, "-")+'.'+name.replace(/ /g, "-")+'"><h3 style="padding-top:15px; color:gray; font-size:14px">'+'@'+ users[i].name + '<span class="fa fa-circle online_friend"></span></h3></a></p>'*/
                
                var list = '<img src="https://placehold.it/100x100" class="pull-left img-circle" style="width:40px; margin-right:10px;"/><p><a id="val" href="/chat/'+userName.replace(/ /g, "-")+'.'+name.replace(/ /g, "-")+'"><h3 style="padding-top:15px; color:gray; font-size:14px">'+'@'+ users[i].name + '<span class="fa fa-circle online_friend"></span></h3></a></p>'
                
                ol.append(list);
                
            //}
        }
        
        $('#numOfFriends').text('('+arr.length+')');//id from group.ejs to display no. of logged in friends
        $('.onlineFriends').html(ol);// to display online friends div class with name 
        
    });
});























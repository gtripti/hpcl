//client
//jquery
$(document).ready(function(){
   var socket = io();
    
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    
    var userPic = $('#name-image').val();
    
    socket.on('connect', function(){
        //console.log('yeah user connected');
        
        var params = {
            room: room,
            name: sender
        }
        
        socket.emit('join', params, function(){
            //console.log('User has joined this channel');
        });
        
    });
    
    socket.on('usersList', function(users){//displaying the list of logged in users, listening from server
       //console.log(users);
        var ol = $('<ol></ol>');
        //display users on views page
        for(var i = 0; i < users.length; i++){//going through the list
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">' + users[i] + '</a></p>');// anchor tag to display model #myModel from views 
        }
        
        $(document).on('click', '#val',function(){//event delegation, id val from above anchor tag
           $('#name').text('@'+$(this).text());//id from views to add the name of the receiver, to get text from the currently clicked anchor tag
            $('#receiverName').val($(this).text());//add value to input field with id receiverName
            $('#nameLink').attr("href","/profile/"+$(this).text());//anchor for view profile
        });
        $('#numValue').text('('+users.length+')');//display number of logged in users
        $('#users').html(ol);//id users on views page and displaying ol
        
    });
    
    socket.on('newMessage', function(data){
        
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
           text: data.text,
            sender: data.from,
            userImage: data.image
        });
        
        $('#messages').append(message);
        
    });
    
    $('#message-form').on('submit',function(e){
        e.preventDefault();
        
        var msg = $('#msg').val();
        
        
       socket.emit('createMessage', {
           text: msg , 
           room: room,
           sender: sender,
           userPic: userPic
           
       }, function(){
           $('#msg').val('');
       });
        
        $.ajax({
            url: '/group/'+room,
            type:'POST',
            data: {
                message: msg,
                groupName: room
            },
            success: function(){
                $('#msg').val('');
            }
        })
        
        
    });
    
});
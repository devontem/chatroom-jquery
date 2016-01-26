// YOUR CODE HERE:
var app = {};
$( document ).ready(function(){
  app.server = 'https://api.parse.com/1/classes/chatterbox';

  app.init = function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
          success: function(data){
          updateChatRoom(data.results);
          console.log(data);
      },
      error: function(data) {
        
      }
    });
  };

  app.send = function(message){
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
        console.log(message);
      },
      error: function (data){
        console.log('error', data);
      }
    });
  };

  app.fetch = function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        app.clearMessages();
        updateChatRoom(data.results);
      },
      error: function(data){
    
      }
    });
  };

  app.clearMessages = function(){
    var $chats = $('#chats');
    $chats.empty();
  }
  
  app.addMessage = function(message){
    var $chats = $('#chats');

    $chats.append('<li class="username" data-username="'+message.username+'"><span><a href="#">'+message.username+": </a></span>"+message.text+'</li>');
  };
  
  app.addRoom = function(roomname){
    $('#roomSelect').append('<option class="' +roomname + '">' + roomname + '</option>');
  };
  
  var friends = [];
  
  app.addFriend = function(username){
    friends.push(username);
  };
 
  var updateChatRoom = function(messages){
    var rooms = [];
    _.each(messages, function(item){
    if(item.roomname && rooms.indexOf(item.roomname) < 0) {
          rooms.push(item.roomname);
        }
      });

    // Appending roomnames
    $selectRooms = $('.rooms');
    for (var i = 0; i < rooms.length; i++) {
      $selectRooms.append('<option class="' + rooms[i] + '">' + rooms[i] + '</option>');
    }
    // Appending messages to the DOM
    var $chats = $('#chats');
    for (var i = 0; i < 10; i++){
      app.addMessage(messages[i]);
      if(friends.indexOf(messages[i].username) > -1) {
        $('li[data-username="' + messages[i].username + '"] span').addClass('bold');
      }
    }

  $('.username').on('click', function(){
    var username = $(this).attr('data-username');
    app.addFriend(username);
    app.fetch();
  });

 };

  var Message = function(){
    this.username = window.location.search.substring(10);
    this.text = $('input[type="text"]').val();
    this.roomName = $('.rooms').val();
  };


  $('.submit').on('click', function(){
    console.log('clicked');
    var messageObject = new Message;
    app.send(messageObject);
  });
  

  app.init();

});
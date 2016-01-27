// YOUR CODE HERE:
var app = {};
window.friends = [];
window.rooms = [];
window.currentRoom = "Default";

$( document ).ready(function(){
  app.server = 'https://api.parse.com/1/classes/chatterbox';

  app.init = function(){
    app.fetch();
  };

  app.send = function(message, chatRoom){
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(){
        app.fetch(chatRoom);
        console.log('worked post!', message);
      },
      error: function (data){
        console.log('error', data);
      }
    });
  };

  app.fetch = function(chatRoom){
    $.ajax({
      url: app.server,
      type:  'GET',
      data: {order: '-createdAt', limit: 20},
      contentType: 'application/json',
      success: function(data){
        var res = data.results;
        app.clearMessages();
        // updateChatRoom(data.results, chatRoom);
        app.roomOptions(res);
        app.roomMessageFilter(res, chatRoom);
      },
      error: function(data){
    
      }
    });
  };

  app.clearMessages = function(){
    $('#chats').empty();
  };
  
  app.addMessage = function(message){
    var $chats = $('#chats');
    $chats.append('<li class="username" data-username="'+message.username+'"><span><a href="#">'+message.username+":</a></span>"+message.text+'</li>');
  };
  
  app.addRoom = function(roomname){
    window.rooms.push(roomname);
    window.currentRoom = roomname;

    app.send(new Message("", "", roomname));
  };
  
  app.addFriend = function(username){
    if(window.friends.indexOf(username) < 0) {
      window.friends.push(username);
    }
  };
  
  app.handleSubmit = function(messageObject, chatRoom){
    app.send(messageObject, chatRoom);
  };
  
  app.feedGenerator = function(dataResult) { //Iterates through data.results from fetch request and
    _.each(dataResult, function(item){        //appends each message object onto the dom
      addMessage(item);
    });
  };
  
  app.roomOptions = function(messages){
    window.rooms = [];
    // pushes all the roomnames to an array
    $selectRooms = $('.roomSelect');
    $selectRooms.empty();
    var node = $('<option class="default">Default</option>').addClass('default');
    // if (node == window.currentRoom) { node.attr('selected', true) }
    $selectRooms.append(node);
    
    _.each(messages, function(item){
    if(item.roomname && window.rooms.indexOf(item.roomname) < 0) {
        window.rooms.push(item.roomname);
        var node = $('<option class="' + item.roomname + '">' + item.roomname + '</option>');
        $selectRooms.append(node);
        
        if (window.currentRoom === item.roomname){
          node.attr('selected', true);
        }
      }
    });
  };
 
 // if no chatRoom 'filter' is passed, all messages are displayed
  app.roomMessageFilter = function(messages, chatRoom){
    var chatRoom = chatRoom || undefined;
  
    _.each(messages, function(item){
      if (item.roomname === chatRoom || chatRoom === undefined){
 
        app.addMessage(item);
        app.checkIfFriend(item.username);
      }
    });
  };
  
  app.checkIfFriend = function(messageObjectUsername){
    if(window.friends.indexOf(messageObjectUsername) > -1) {
      $('li[data-username="' + messageObjectUsername + '"] span').addClass('bold');
    }
  };
  
  // Username click handler to add friends

  $('.username').on('click', function(){
    var username = $(this).attr('data-username');
    app.addFriend(username);
    app.fetch();
  });
  
  // Click handler for when room options change (append only messages with correct roomname value)

  $('.roomSelect').on('change', function(){ 
    window.currentRoom = $(this).val();
    
    app.fetch(window.currentRoom);
    
  });
 
   var Message = function(username, text, roomName){
    this.username = _.escape(username);
    this.text = _.escape(text);
    this.roomName = _.escape(roomName);
  };
 
  // Submit button click handler for posting message to server 

  $('.submit').on('click', function(){
    console.log('clicked');
    var messageObject = new Message(window.location.search.substring(10), 
      $('#message').val(), 
      $('.roomSelect').val());
    
    $('#message').val('');
    app.handleSubmit(messageObject);
  });
  
  $('.addRoom').on('click', function(){
    var roomName = $('.roomInput').val();
    app.addRoom(roomName);
  })
  
  
  app.init();

});
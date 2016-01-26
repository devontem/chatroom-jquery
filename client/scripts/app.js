// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
        success: function(data){
        updateChatRoom(data.results);
    },
    error: function(data) {
      
    }
  });
};
app.send = function(){};
app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      updateChatRoom(data.results);
    },
    error: function(data) {}
  });
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
  var $messages = $('.messages');
  for (var i = 0; i < 10; i++){
    $messages.append('<li>'+messages[i]['text']+'</li>');
  }
};

app.init();


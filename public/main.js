var server = io();

server.on('connect', function (s) {
  console.log('connected');
  server.emit('user joined', {username: username});

});
server.on('new user', function(alert) {
  $( "#chat-box" ).append('<i class="text-muted">' + alert.username + ' has joined the channel<\/i><br\/>');
});
server.on('new message', function(msg) {
  console.log(msg);
  $( "#chat-box" ).append('<span class="text-primary">' + msg.username + '<\/span>' + ': ' + msg.message + '<br\/>');
});

function sendMessage_enter(event) {
  var char = event.which || event.keyCode;
  if (char == '13') {
    var msg = document.getElementById("send_message");
    server.emit('chat message', {
      username: username,
      message: msg.value
    });
    msg.value = '';
  }
}

const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(body_parser.urlencoded({extended: false}));
app.use('/socket-io',
  express.static('node_modules/socket.io-client/dist'));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

var username;

app.get('/', function (req, res) {
  res.render('index.html');
});

app.post('/submit', function (req, res) {
  username = req.body.username;
  res.redirect('/chat');
});

app.get('/chat', function(req, res) {
  if (username === undefined) {
    res.redirect('/');
  } else {
    context = { 'username': username };
    res.render('chat.html', context);
  }
});

io.on('connection', function(client) {

  client.on('user joined', function(alert) {
    io.emit('new user', {
      username: alert.username
    });
  });

  client.on('disconnect', function () {
    var msg = 'user has disconnected'
  });

  client.on('chat message', function(msg){
    console.log(msg);
    io.emit('new message', {
      username: msg.username,
      message: msg.message
    });
  });
});

http.listen(8080, function(){
  console.log('listening on 8080');
});

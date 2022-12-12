var express = require('express');
const app = express();
const http = require('http');
// io = require('socket.io').listen(http);
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
server.listen(3000);

//server connections and routing
app.use(express.static(__dirname + '/public'), function (request, response) {
  if (request.url !== '/public') {
    response.sendFile(__dirname + '/error/index.html');
    console.log('Error 404 request, User tried accessing: ' + __dirname + request.url);
  }
});
var players = [];

//Lets create a function which will help us to create multiple players
function newPlayer() {
  this.name;
  this.id = 1;
  this.x = Math.random() * 500;
  this.y = Math.random() * 500;
  //Random colors
  var r = Math.random() * 255 >> 0;
  var g = Math.random() * 255 >> 0;
  var b = Math.random() * 255 >> 0;
  this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.5)";

  //Random size
  this.radius = Math.random() * 20 + 20;
  this.speed = 5;

  return { 'name': this.name, "x": this.x, "y": this.y, "color": this.color, "radius": this.radius, "speed": this.speed }
}


//calls to the server and tracking connection of each new user
io.sockets.on('connection', function (socket) {
  var currentPlayer = new newPlayer(); //new player made
  players.push(currentPlayer); //push player object into array

  //create the players Array
  socket.broadcast.emit('currentUsers', players);
  socket.emit('welcome', currentPlayer, players);
  socket.emit("map", {
    data: [

      {
        x: 1957.420283785552, y: 758.7271390603566,
        vx: -0.9986210639852892, vy: 0.05249733864577413,
        angle: 3.0890711714695933,
        speed: 1.,//- .5,
        level: 11,

        // angle: 0.21924352023509025,
        // level: 12,
        // speed: 1,
        // vx: 0.9760622563745031,
        // vy: 0.21749131403601793,
        // y: 45.888490226337446,
        // x: -298.2134305259228
      }
    ]
  });

  //disconnected
  socket.on('disconnect', function () {
    players.splice(players.indexOf(currentPlayer), 1);
    console.log(players);
    socket.broadcast.emit('playerLeft', players);
  });

  socket.on('pressed', function (key) {
    if (key === 38) {
      currentPlayer.y -= currentPlayer.speed;
      socket.emit('PlayersMoving', players);
      socket.broadcast.emit('PlayersMoving', players);
    }
    if (key === 40) {
      currentPlayer.y += currentPlayer.speed;
      socket.emit('PlayersMoving', players);
      socket.broadcast.emit('PlayersMoving', players);
    }
    if (key === 37) {
      currentPlayer.x -= currentPlayer.speed;
      socket.emit('PlayersMoving', players);
      socket.broadcast.emit('PlayersMoving', players);
    }
    if (key === 39) {
      currentPlayer.x += currentPlayer.speed;
      socket.emit('PlayersMoving', players);
      socket.broadcast.emit('PlayersMoving', players);
    }
  });
});
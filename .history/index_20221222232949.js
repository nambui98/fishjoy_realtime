var express = require("express");
const app = express();
const http = require("http");
// io = require('socket.io').listen(http);
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
server.listen(5000);

//server connections and routing
app.use(express.static(__dirname + "/public"), function (request, response) {
  if (request.url !== "/public") {
    response.sendFile(__dirname + "/error/index.html");
    console.log(
      "Error 404 request, User tried accessing: " + __dirname + request.url
    );
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
  var r = (Math.random() * 255) >> 0;
  var g = (Math.random() * 255) >> 0;
  var b = (Math.random() * 255) >> 0;
  this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.5)";

  //Random size
  this.radius = Math.random() * 20 + 20;
  this.speed = 5;

  return {
    name: this.name,
    x: this.x,
    y: this.y,
    color: this.color,
    radius: this.radius,
    speed: this.speed,
  };
}

//calls to the server and tracking connection of each new user
io.sockets.on("connection", function (socket) {
  var currentPlayer = new newPlayer(); //new player made
  let dataFish = [
    // {
    //   id: 1,
    //   x: -126.35776751870131,
    //   y: 242.728759430727,
    //   vx: 0.9306887756376916,
    //   vy: -0.36581197752672684,
    //   angle: -0.37450510161041906,
    //   speed: 1,
    //   level: 9,
    // },
    {
      id: 2,
      x: 1965.3684102893926,
      y: 170.9943115569273,
      vx: -0.7225036368995164,
      vy: -0.6913671200360716,
      angle: 3.90497219563685,
      speed: 1,
      level: 3,
    },
    {
      id: 3,
      x: -293.77688077808034,
      y: 90.35451388888889,
      vx: 0.9857764399592277,
      vy: 0.16806192436513148,
      angle: 0.16886329853979085,
      speed: 1,
      level: 11,
    },
    {
      id: 4,
      x: -71.70843592684079,
      y: 174.4636874142661,
      vx: 0.9784795393411914,
      vy: 0.20634386613284603,
      angle: 0.20783693168231865,
      speed: 1,
      level: 8,
    },
    {
      id: 5,
      x: -75.53948204448263,
      y: 456.716893861454,
      vx: 0.8882945917234611,
      vy: -0.459274121102909,
      angle: -0.47717786563206077,
      speed: 1,
      level: 5,
    },
    {
      id: 6,
      x: 1963.201053877661,
      y: 48.80549125514403,
      vx: -0.9444834985555467,
      vy: 0.3285588546307567,
      angle: 2.806815339736961,
      speed: 1,
      level: 3,
    },
    {
      id: 7,
      x: -59.43303404378473,
      y: 506.939356138546,
      vx: 0.9783626714449389,
      vy: 0.20689727674167768,
      angle: 0.20840254764361307,
      speed: 1,
      level: 6,
    },
    {
      id: 8,
      x: 2046.6035996747723,
      y: 361.7357724622771,
      vx: -0.9287945811709575,
      vy: 0.37059496217226934,
      angle: 2.761943140140934,
      speed: 1,
      level: 9,
    },
    {
      id: 9,
      x: 2043.82949727479,
      y: 287.7749871399177,
      vx: -0.9476076403482198,
      vy: -0.31943662901063646,
      angle: 3.4667275620072244,
      speed: 1,
      level: 9,
    },
    {
      id: 10,
      x: 2219.0960755411243,
      y: 518.8224322702332,
      vx: -0.7810884318957197,
      vy: -0.6244204205170468,
      angle: 3.8159819510598543,
      speed: 1,
      level: 11,
    },
    {
      id: 1,
      x: -126.35776751870131,
      y: 242.728759430727,
      vx: 0.9306887756376916,
      vy: -0.36581197752672684,
      angle: -0.37450510161041906,
      speed: 1,
      level: 9,
    },
  ];
  players.push(currentPlayer); //push player object into array

  //create the players Array
  socket.broadcast.emit("currentUsers", players);
  socket.emit("welcome", currentPlayer, players);
  socket.emit("map", {
    data: dataFish,
  });

  //disconnected
  socket.on("disconnect", function () {
    players.splice(players.indexOf(currentPlayer), 1);
    console.log(players);
    socket.broadcast.emit("playerLeft", players);
  });
  socket.on("updateLocation", function (location) {
    // console.log(location);
    let index = dataFish.findIndex(f => f.id === location.id);
    if (index >= 0) {
      dataFish[index].x = location.x;
      dataFish[index].y = location.y;
    }
    // socket.emit("map", {
    //   data: dataFish,
    // });

    // dataFish = 
  });
  socket.on("pressed", function (key) {
    if (key === 38) {
      currentPlayer.y -= currentPlayer.speed;
      socket.emit("PlayersMoving", players);
      socket.broadcast.emit("PlayersMoving", players);
    }
    if (key === 40) {
      currentPlayer.y += currentPlayer.speed;
      socket.emit("PlayersMoving", players);
      socket.broadcast.emit("PlayersMoving", players);
    }
    if (key === 37) {
      currentPlayer.x -= currentPlayer.speed;
      socket.emit("PlayersMoving", players);
      socket.broadcast.emit("PlayersMoving", players);
    }
    if (key === 39) {
      currentPlayer.x += currentPlayer.speed;
      socket.emit("PlayersMoving", players);
      socket.broadcast.emit("PlayersMoving", players);
    }
  });
});

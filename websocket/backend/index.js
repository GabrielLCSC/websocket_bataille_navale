const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ip = require("ip");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let users = {};
let rooms = {};
let games = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    Object.keys(rooms).forEach((room) => {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
      io.to(room).emit("users", getUsersInRoom(room));
      io.to(room).emit("roomUpdated", rooms[room]); // Emit roomUpdated event
    });
    delete users[socket.id];
  });

  socket.on("gameWon", (room) => {
    io.to(room).emit("reload");
  });

  socket.on("join", (room) => {
    console.log(`join room:  ${room}`);
    if (rooms[room] && rooms[room].length >= 2) {
      socket.emit("error", "La salle est pleine");
      return;
    }
    socket.join(room);
    socket.emit("join", room);
    if (!rooms[room]) {
      rooms[room] = [];
      games[room] = [];
    }
    rooms[room].push(socket.id);
    io.to(room).emit("users", getUsersInRoom(room)); // Émet les utilisateurs de la room
    io.to(room).emit("roomUpdated", rooms[room]); // Emit roomUpdated event

    if (rooms[room][0] === socket.id) {
      socket.emit("quiEtesVous", "Vous êtes le joueur 1");
    } else {
      socket.emit("quiEtesVous", "Vous êtes le joueur 2");
    }
  });

  socket.on("boatPlaced", (room, data) => {
    console.log("bateau placé");
    games[room].push(data);
    if (games[room].length === 2) {
      io.to(room).emit("startGame", games[room]);
    }
  });

  socket.on("cellClicked", (room, data) => {
    const game = games[room];
    const player = game.find((game) => game.player !== data.player);
    const cell = data.cell.split("-");
    if (player.tab[cell[0]][cell[1]] === 1) {
      io.to(room).emit("cellClicked", "touché", data.cell); // Emit to all clients in the room
    } else {
      io.to(room).emit("cellClicked", "raté", data.cell); // Emit to all clients in the room
    }
  });

  socket.on("getMyGrid", (room, joueur) => {
    if (games[room]) {
      const game = games[room].find((game) => game.player === joueur);
      if (game) {
        socket.emit("myGrid", game.tab);
      }
    }
  });

  socket.on("leave", (room) => {
    console.log(`leave room: ${room}`);
    socket.leave(room);
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) {
        delete games[room];
        delete rooms[room];
      }
    }
    delete users[socket.id];
    io.to(room).emit("users", getUsersInRoom(room)); // Émet les utilisateurs de la room
    io.to(room).emit("roomUpdated", rooms[room]); // Emit roomUpdated event

    // Emit clearGrids event
    socket.emit("clearGrids");
  });

  socket.on("getUsers", (room) => {
    socket.emit("users", { users: rooms[room] }); // Émet les utilisateurs de la room
  });
});

function getUsersInRoom(room) {
  return rooms[room] || [];
}

server.listen(PORT, () => {
  console.log(`Server ip : http://${ip.address()}:${PORT}`);
});

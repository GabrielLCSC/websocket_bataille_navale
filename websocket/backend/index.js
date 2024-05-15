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

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    Object.keys(rooms).forEach((room) => {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
      io.to(room).emit("users", getUsersInRoom(room));
    });
    delete users[socket.id];
  });

  socket.on("join", (room) => {
    console.log(`join room: ${room}`);
    socket.join(room);
    if (rooms[room] === undefined) rooms[room] = [];
    rooms[room].push(socket.id);
    console.log(rooms[room][0]);
    io.to(room).emit("users", getUsersInRoom(room)); // Émet les utilisateurs de la room
  });

  socket.on("leave", (room) => {
    console.log(`leave room: ${room}`);
    socket.leave(room);
    if (rooms[room] !== undefined) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
    }
    delete users[socket.id];
    io.to(room).emit("users", getUsersInRoom(room)); // Émet les utilisateurs de la room
  });

  // Nouvel événement pour obtenir tous les utilisateurs connectés à une room spécifique
  socket.on("getUsers", (room) => {
    socket.emit("users", { users: rooms[room] }); // Émet les utilisateurs de la room
  });
});

function getUsersInRoom(room) {
  return Object.keys(rooms)
    .filter((socketId) => rooms[socketId] === room)
    .map((socketId) => users[socketId]);
}

server.listen(PORT, () => {
  console.log(`Server ip : http://${ip.address()}:${PORT}`);
});

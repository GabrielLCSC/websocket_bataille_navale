import express from "express";
import http from "http";
import ip from "ip";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const PORT = 3001;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.json(`ip address: http://${ip.address()}:${PORT}`);
});

let userId = 0;
let users = {}; // Stocke les utilisateurs connectés
let rooms = {}; // Stocke les utilisateurs par room

io.on("connection", (socket) => {
  userId++;
  users[socket.id] = `Joueur ${userId}`; // Ajoute l'utilisateur à l'objet users

  console.log(`Le joueur ${userId} est connecté`);
  socket.broadcast.emit("user connected", userId);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const room = rooms[socket.id];
    if (room) {
      // Supprime l'utilisateur de la room
      rooms[socket.id] = null;
      io.to(room).emit("users", getUsersInRoom(room));
    }
    delete users[socket.id]; // Supprime l'utilisateur de l'objet users
    socket.broadcast.emit("user disconnected");
  });

  socket.on("message", (msg) => {
    console.log(`message: ${msg}`);
    io.emit("message", msg);
  });

  socket.on("room", (room, msg) => {
    console.log(`room: ${room} message: ${msg}`);
    io.to(room).emit("message", msg);
  });

  socket.on("join", (room) => {
    console.log(`join room: ${room}`);
    socket.join(room);
    rooms[socket.id] = room;
    io.to(room).emit("users", getUsersInRoom(room)); // Émet les utilisateurs de la room
  });

  socket.on("leave", (room) => {
    console.log(`leave room: ${room}`);
    socket.leave(room);
    rooms[socket.id] = null;
    io.to(room).emit("users", getUsersInRoom(room)); // Émet les utilisateurs de la room
  });

  // Nouvel événement pour obtenir tous les utilisateurs connectés à une room spécifique
  socket.on("getUsers", (room) => {
    socket.emit("users", getUsersInRoom(room));
  });
});

function getUsersInRoom(room) {
  return Object.keys(rooms).filter(socketId => rooms[socketId] === room).map(socketId => users[socketId]);
}

server.listen(PORT, () => {
  console.log(`Server ip : http://${ip.address()}:${PORT}`);
});

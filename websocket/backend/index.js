const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const ip = require("ip");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

app.use(cors());
app.use(express.static("frontend"));

let players = {};
let choices = {};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // When a player joins the game
  socket.on("join", (name) => {
    players[socket.id] = name;
    choices[socket.id] = null;
    io.emit("players", Object.values(players));
  });

  // When a player makes a choice
  socket.on("choice", (choice) => {
    choices[socket.id] = choice;
    if (Object.values(choices).every((choice) => choice !== null)) {
      // Determine the winner
      let [player1, player2] = Object.keys(players);
      let choice1 = choices[player1];
      let choice2 = choices[player2];

      let result = "";
      if (choice1 === choice2) {
        result = "It's a tie!";
      } else if (
        (choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "scissors" && choice2 === "paper") ||
        (choice1 === "paper" && choice2 === "rock")
      ) {
        result = `${players[player1]} wins!`;
      } else {
        result = `${players[player2]} wins!`;
      }

      io.emit("result", result);
      choices = {};
    }
  });

  // When a player disconnects
  socket.on("disconnect", () => {
    delete players[socket.id];
    delete choices[socket.id];
    io.emit("players", Object.values(players));
    console.log(`Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://${ip.address()}:${PORT}/`);
});

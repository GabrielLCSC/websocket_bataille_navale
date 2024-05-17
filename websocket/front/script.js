document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  document.getElementById("joinButton").addEventListener("click", joinGame);
  document.querySelectorAll(".choice").forEach((element) => {
    element.addEventListener("click", () => makeChoice(element.dataset.choice));
  });

  function joinGame() {
    const name = document.getElementById("name").value;
    if (name.trim() !== "") {
      socket.emit("join", name);
      document.getElementById("playerName").textContent = name;
      document.getElementById("join").style.display = "none";
      document.getElementById("game").style.display = "block";
    }
  }

  function makeChoice(choice) {
    socket.emit("choice", choice);
  }

  socket.on("players", (players) => {
    const playersList = document.getElementById("players");
    playersList.innerHTML = "";
    players.forEach((player) => {
      const li = document.createElement("li");
      li.textContent = player;
      playersList.appendChild(li);
    });
  });

  socket.on("result", (result) => {
    document.getElementById("result").textContent = result;
  });
});

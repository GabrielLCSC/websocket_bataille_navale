let joueur = 1;
let bateaux = { 1: 0, 2: 0, 3: 0 }; // Number of cells occupied by boats for each player

const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function generateGrid(player) {
  let grid = document.getElementById(`grid${player}`);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      grid.innerHTML += `<div class="cell" id="${i}-${j}" style="background-color: white;" onclick="checkCell(this, ${player})"></div>`;
    }
  }

  //   grid.innerHTML = "<div></div>"; // Empty top-left corner
  //   for (let i = 0; i < 10; i++) {
  //     grid.innerHTML += `<div>${numbers[i]}</div>`; // Numbers on top
  //   }
  //   for (let i = 0; i < 10; i++) {
  //     grid.innerHTML += `<div>${letters[i]}</div>`; // Letters on the left
  //     for (let j = 0; j < 10; j++) {
  //       grid.innerHTML += `<div id="p${player}${letters[i]}${numbers[j]}" onclick="checkCell(this, ${player})"></div>`; // Grid cells
  //     }
  //   }
}

// for(let i=0; i<10; i++){
//     for(let j=0; j<10; j++){
//       if(grid[i][j] === 1){
//         document.getElementById('grid1').innerHTML += `<div class="cell" id="${i}-${j}" style="background-color: blue;"></div>`;
//       }else{
//         document.getElementById('grid1').innerHTML += `<div class="cell" id="${i}-${j}" style="background-color: white;"></div>`;
//       }
//     }
//   }

function checkCell(cell, player) {
  if (cell.style.backgroundColor !== "blue" && bateaux[player] < 9) {
    cell.style.backgroundColor = "blue";
    bateaux[player]++;
  }
}

function generateBoats(player) {
  console.log("bateaux placés start");
  const boatSizes = [2, 3, 4]; // Sizes of the boats
  let arraywithboat = [];
  //create matrix 10x10
  for (let i = 0; i < 10; i++) {
    arraywithboat[i] = [];
    for (let j = 0; j < 10; j++) {
      arraywithboat[i][j] = 0;
    }
  }
  arraywithboat[0][0] = 1;
  arraywithboat[0][1] = 1;
  arraywithboat[0][2] = 1;
  if (joueur === 1) {
    arraywithboat[0][3] = 1;
    arraywithboat[0][4] = 1;
  } else {
    arraywithboat[1][0] = 1;
    arraywithboat[2][0] = 1;
  }
  //alea a faire

  socket.emit("boatPlaced", room, {
    player: joueur,
    tab: arraywithboat,
  });
  console.log("bateaux placés");
}

// document.getElementById("sendButton").addEventListener("click", () => {
//   //on renvoie les 2 grilles au serveur
//   console.log("sendButton");
// });

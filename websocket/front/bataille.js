let joueur = 1;
let bateaux = { 1: 0, 2: 0, 3: 0 };
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function generateGrid(player) {
  let grid = document.getElementById(`grid${player}`);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      grid.innerHTML += `<div class="cell" id="p${player}-${i}-${j}" style="background-color: white;" onclick="checkCell(this)"></div>`;
    }
  }
}

function checkCell(cell) {
  // Envoie les coordonnées de la cellule au serveur
  console.log(cell.id);
  socket.emit("cellClicked", room, {
    player: joueur,
    cell: cell.id,
  });
}

function generateBoats(player) {
  console.log("bateaux placés start");
  const boatSizes = [2, 3, 4]; // Taille des bateaux
  let arraywithboat = [];

  // Crée une matrice 10x10
  for (let i = 0; i < 10; i++) {
    arraywithboat[i] = [];
    for (let j = 0; j < 10; j++) {
      arraywithboat[i][j] = 0;
    }
  }

  // Placement des bateaux dans la grille
  for (let size of boatSizes) {
    let placed = false;
    while (!placed) {
      let direction = Math.floor(Math.random() * 2); // 0 pour horizontal, 1 pour vertical
      let startRow, startCol;

      if (direction === 0) {
        // Horizontal
        startRow = Math.floor(Math.random() * 10);
        startCol = Math.floor(Math.random() * (10 - size + 1));
      } else {
        // Vertical
        startRow = Math.floor(Math.random() * (10 - size + 1));
        startCol = Math.floor(Math.random() * 10);
      }

      let canPlace = true;
      for (let i = 0; i < size; i++) {
        if (direction === 0) {
          // Horizontal
          if (arraywithboat[startRow][startCol + i] === 1) {
            canPlace = false;
            break;
          }
        } else {
          // Vertical
          if (arraywithboat[startRow + i][startCol] === 1) {
            canPlace = false;
            break;
          }
        }
      }

      if (canPlace) {
        for (let i = 0; i < size; i++) {
          if (direction === 0) {
            // Horizontal
            arraywithboat[startRow][startCol + i] = 1;
          } else {
            // Vertical
            arraywithboat[startRow + i][startCol] = 1;
          }
        }
        placed = true;
      }
    }
  }

  // Envoi des données de placement des bateaux au serveur
  socket.emit("boatPlaced", room, {
    player: joueur,
    tab: arraywithboat,
  });
  console.log("bateaux placés");
}

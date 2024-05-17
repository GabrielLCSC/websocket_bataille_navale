let joueur = 1;
let bateaux = {1: 0, 2: 0, 3: 0}; // Number of cells occupied by boats for each player

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function generateGrid(player) {
    let grid = document.getElementById(`grid${player}`);
    grid.innerHTML = '<div></div>'; // Empty top-left corner
    for (let i = 0; i < 10; i++) {
        grid.innerHTML += `<div>${numbers[i]}</div>`; // Numbers on top
    }
    for (let i = 0; i < 10; i++) {
        grid.innerHTML += `<div>${letters[i]}</div>`; // Letters on the left
        for (let j = 0; j < 10; j++) {
            grid.innerHTML += `<div id="p${player}${letters[i]}${numbers[j]}" onclick="checkCell(this, ${player})"></div>`; // Grid cells
        }
    }
}

function checkCell(cell, player) {
    if (cell.style.backgroundColor !== 'blue' && bateaux[player] < 9) {
        cell.style.backgroundColor = 'blue';
        bateaux[player]++;
    }
}

function generateBoats(player) {
    const boatSizes = [2, 3, 4]; // Sizes of the boats
    for (let size of boatSizes) {
        let placed = false;
        while (!placed) {
            let direction = Math.random() < 0.5 ? 'horizontal' : 'vertical'; // Random direction
            let startRow, startCol;
            if (direction === 'horizontal') {
                startRow = Math.floor(Math.random() * 10); // Random row
                startCol = Math.floor(Math.random() * (10 - size + 1)); // Random column, making sure the boat fits in the grid
            } else {
                startRow = Math.floor(Math.random() * (10 - size + 1)); // Random row, making sure the boat fits in the grid
                startCol = Math.floor(Math.random() * 10); // Random column
            }
            // Check if the cells are free
            let free = true;
            for (let i = 0; i < size; i++) {
                let cell;
                if (direction === 'horizontal') {
                    cell = document.getElementById(`p${player}${letters[startRow]}${numbers[startCol + i]}`);
                } else {
                    cell = document.getElementById(`p${player}${letters[startRow + i]}${numbers[startCol]}`);
                }
                if (cell.style.backgroundColor === 'blue') {
                    free = false;
                    break;
                }
            }
            // If the cells are free, place the boat
            if (free) {
                for (let i = 0; i < size; i++) {
                    let cell;
                    if (direction === 'horizontal') {
                        cell = document.getElementById(`p${player}${letters[startRow]}${numbers[startCol + i]}`);
                    } else {
                        cell = document.getElementById(`p${player}${letters[startRow + i]}${numbers[startCol]}`);
                    }
                    cell.style.backgroundColor = 'blue';
                    bateaux[player]++;
                }
                placed = true;
            }
        }
    }
}

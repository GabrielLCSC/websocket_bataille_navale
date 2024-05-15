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

window.onload = function() {
    generateGrid(1);
    generateGrid(2);
}
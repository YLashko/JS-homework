let sudoku = Array(9).fill().map(() => Array(9).fill(0));

function incNumber(el, x, y) {
    sudoku[x][y] = (sudoku[x][y] + 1) % 10;
    el.innerHTML = sudoku[x][y] == 0 ? "" : sudoku[x][y];
    markRepeating();
}

function markRepeating() {
    for (let x = 0; x < 9; x++){
        for (let y = 0; y < 9; y++){
            if ((numbersInRow(y, sudoku[x][y]) > 1 ||
                 numbersInCol(x, sudoku[x][y]) > 1 ||
                 numbersInSquare(x, y, sudoku[x][y]) > 1) &&
                 sudoku[x][y] != 0) {
                document.getElementById("number-" + x + "-" + y).style.backgroundColor = "#FA8072";
            } else {
                document.getElementById("number-" + x + "-" + y).style.backgroundColor = "white";
            }
        }
    }
}

function chooseNumber(el, num) {
    for (i = 0; i < 9; i++) {
        document.getElementById("sudoku-choose-number-" + i).style.backgroundColor = "white";
    }
    el.style.backgroundColor = "#FFE4B5";
    for (let x = 0; x < 9; x++){
        for (let y = 0; y < 9; y++){
            if (sudoku[x][y] == 0 && 
            numbersInRow(y, num) == 0 &&
            numbersInCol(x, num) == 0 &&
            numbersInSquare(x, y, num) == 0) {
                document.getElementById("number-" + x + "-" + y).style.backgroundColor = "#98FB98";
            } else {
                document.getElementById("number-" + x + "-" + y).style.backgroundColor = "white";
            }
        }
    }
}

function numbersInCol(r, num) {
    let count = 0;
    for (let col = 0; col < 9; col++) {
        if (sudoku[r][col] == num){ count++; }
    }
    return count;
}

function numbersInRow(c, num) {
    let count = 0;
    for (let row = 0; row < 9; row++) {
        if (sudoku[row][c] == num){ count++; }
    }
    return count;
}

function numbersInSquare(x_, y_, num){
    let count = 0;
    let sqX = Math.floor(x_ / 3);
    let sqY = Math.floor(y_ / 3);
    for (let x = sqX * 3; x < sqX * 3 + 3; x++){
        for (let y = sqY * 3; y < sqY * 3 + 3; y++){
            if (sudoku[x][y] == num) { count++; }
        }
    }
    return count;
}
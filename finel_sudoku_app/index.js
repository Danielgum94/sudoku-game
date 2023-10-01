// RANDOM INTEGER BETWEEN "min-max" (NOT INCLUDING MAX)
function randomize(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// DUPLICATES COMPLETE SUDOKU MATRIX, SO WE CAN REMOVE TILES LATER
function duplicateMatrix(sourceMatrix) {
  let newMatrix = [];

  for (let i = 0; i < 9; i++) {
    newMatrix.push(new Array());
    for (let j = 0; j < 9; j++) {
      newMatrix[i][j] = sourceMatrix[i][j];
    }
  }

  return newMatrix;
}

// LOGIN

function login() {
  let username = document.getElementById("uname").value;
  let password = document.getElementById("pwd").value;

  // verify inputs
  if (username != "abcd" || password != "1234") {
    alert("Wrong username or password");
  } else {
    // remove login
    let loginEl = document.getElementById("login");
    loginEl.style.display = "none";

    // and load the difficulty buttons
    let difficultyEl = document.getElementById("difficulty-buttons");
    difficultyEl.style.display = "unset";
  }
}

// GAME MEMORY AND SETTINGD

let storedDifficulty = "";
let rawMatrix = [];
let playMatrix = [];

// GAME FUNCTIONS

function drawBoard(element) {
  let squares = 81;

  for (let i = 0; i < squares; i++) {
    let inputEl = document.createElement("input");

    inputEl.id = `sud-inp-${i + 1}`;
    inputEl.setAttribute("type", "number");
    inputEl.setAttribute("min", "1");
    inputEl.setAttribute("max", "9");
   

    if (
      ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
      ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
      ((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && i > 27 && i < 53) ||
      ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
      ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
    ) {
      // [X X X] X X X [X X X]
      // [X X X] X X X [X X X]
      // [X X X] X X X [X X X]
      //  X X X [X X X] X X X
      //  X X X [X X X] X X X
      //  X X X [X X X] X X X
      // [X X X] X X X [X X X]
      // [X X X] X X X [X X X]
      // [X X X] X X X [X X X]

      inputEl.classList.add("odd-places");
    } else {
      inputEl.classList.add("even-places");
    }

    element.appendChild(inputEl);
  }
}

function getSudokuMatrix() {
  let matrix1 = [
    [2, 1, 8, 7, 5, 9, 4, 6, 3],
    [5, 9, 3, 4, 6, 8, 7, 2, 1],
    [4, 6, 7, 2, 1, 3, 9, 8, 5],
    [9, 7, 4, 8, 3, 5, 6, 1, 2],
    [6, 3, 2, 1, 9, 4, 8, 5, 7],
    [1, 8, 5, 6, 2, 7, 3, 9, 4],
    [3, 2, 1, 9, 4, 6, 5, 7, 8],
    [7, 4, 9, 5, 8, 2, 1, 3, 6],
    [8, 5, 6, 3, 7, 1, 2, 4, 9],
  ];

  let matrix2 = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  let matrix3 = [
    [3, 8, 7, 4, 9, 1, 6, 2, 5],
    [2, 4, 1, 5, 6, 8, 3, 7, 9],
    [5, 6, 9, 3, 2, 7, 4, 1, 8],
    [7, 5, 8, 6, 1, 9, 2, 3, 4],
    [1, 2, 3, 7, 8, 4, 5, 9, 6],
    [4, 9, 6, 2, 5, 3, 1, 8, 7],
    [9, 3, 4, 1, 7, 6, 8, 5, 2],
    [6, 7, 5, 8, 3, 2, 9, 4, 1],
    [8, 1, 2, 9, 4, 5, 7, 6, 3],
  ];

  let allMatrixes = [matrix1, matrix2, matrix3];
  let randomNum = randomize(0, allMatrixes.length);

  return allMatrixes[randomNum];
}

function removeTilesFromMatrixPerDifficulty(matrix, difficulty) {
  let numOfTilesToClear = 0;

  // set the number of tiles to clear
  if (difficulty == "easy") {
    numOfTilesToClear = Math.floor(81 * 0.25);
  } else if (difficulty == "normal") {
    numOfTilesToClear = Math.floor(81 * 0.5);
  } else if (difficulty == "hard") {
    numOfTilesToClear = Math.floor(81 * 0.75);
  }

  // target and clear random tiles on the matix
  for (let i = 0; i < numOfTilesToClear; i++) {
    let rowIdx = randomize(0, 9);
    let colIdx = randomize(0, 9);

    // clear if not cleared already
    if (matrix[rowIdx][colIdx] != null) {
      matrix[rowIdx][colIdx] = null;
    } else {
      i--;
    }
  }

  return matrix;
}

function putMatrixOnBoard(matrix) {
  let tileNum = 1; // 1 - 81

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let inputEl = document.getElementById(`sud-inp-${tileNum}`);
      inputEl.value = matrix[i][j];

      // if this tile is supposed to be READ ONLY
      if (matrix[i][j] != null) {
        inputEl.disabled = true;
      }

      tileNum++;
    }
  }
}

function loadGameWithDifficulty(difficulty) {
  // difficulty === "easy" || "normal" || "hard"
  storedDifficulty = difficulty;

  // remove difficulty buttons
  let difficultyButtonsEl = document.getElementById("difficulty-buttons");
  difficultyButtonsEl.style.display = "none";

  // and load the puzzle and game buttons
  let puzzleEl = document.getElementById("puzzle");
  puzzleEl.style.display = "unset";

  drawBoard(puzzleEl);

  let gampeplayButtonsEl = document.getElementById("gameplay-buttons");
  gampeplayButtonsEl.style.display = "unset";



  // get a matrix and set it with deep copy into new variables
  let sudokuMatrix = getSudokuMatrix();
  rawMatrix = duplicateMatrix(sudokuMatrix); // this is to compare with
  playMatrix = duplicateMatrix(sudokuMatrix); // this is to remove tiles and have the user play with

  playMatrix = removeTilesFromMatrixPerDifficulty(playMatrix, difficulty);
  putMatrixOnBoard(playMatrix);
}

function againButton() {
  putMatrixOnBoard(playMatrix);
}

function goBackAndRefresh() {
  window.history.go(-1);
  setTimeout(() => {
    location.reload();
  }, 0);
}

function finishButton() {
  let tileNum = 1; // 1 - 81
  let isValid = true;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let inputEl = document.getElementById(`sud-inp-${tileNum}`);

      if (inputEl.value != rawMatrix[i][j]) {
        isValid = false;
        inputEl.style.color = "red";
      } else {
        inputEl.style.color = "black";
      }

      tileNum++;
    }
  }

  if (isValid) {
    alert(`success`);
    goBackAndRefresh();
  } else {
    alert(`Try agin`);
  }
}

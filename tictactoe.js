/**
 * @author ayayrom
 * @date 06/29/2025 (US)
*/

//SETTING UP GRID
const grid = document.getElementById("grid");
const gameBtn = document.getElementById("gameBtn");
let turn = true; //true is X, false is O
let turnCount = 0; // misc, dunno what to use for yet
let board = Array(9).fill(null);
let msg = document.getElementById("winMsg");
const winPos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

startGame();

/**
 * Initializes the tic-tac-toe board
 */
function startGame() {
  for (i = 0; i < 9; i++) {
    const button = document.createElement("button");
    //STYLE
    button.id = "tic" + i;
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.fontFamily = "sans-serif";
    button.style.fontSize = "30px";
    button.disabled = true;

    // required to do this because button text makes life hard
    const tooltip = document.createElement("div");
    applyFormat(tooltip);
    button.appendChild(tooltip);

    //CLICK EVENT vvvv
    button.onclick = function () {
      insMove(this);
    };

    grid.appendChild(button);
  }
}

/**
 * Helper function to reduce redundancy when applying tooltip format
 * @param {HTMLElement} tooltip
 */
function applyFormat(tooltip) {
  tooltip.innerText = "x";
  tooltip.style.position = "absolute";
  tooltip.style.paddingLeft = "10px";
  tooltip.style.lineHeight = "0px";
  tooltip.style.marginTop = "-3px";
  tooltip.style.marginLeft = "0px";
  tooltip.style.color = "black";
  tooltip.style.fontSize = "45px";
  tooltip.style.visibility = "hidden"; // hide by default
  tooltip.style.whiteSpace = "nowrap";
  tooltip.style.userSelect = "none";
}

/**
 * Helper function for viz
 */
function showTooltip() {
  const tip = this.querySelector("div");
  tip.innerText = turn ? "x" : "o";
  tip.style.visibility = "visible";
}

/**
 * Helper function for viz
 */
function hideTooltip() {
  const tip = this.querySelector("div");
  tip.innerText = turn ? "x" : "o";
  tip.style.visibility = "hidden";
}

/**
 * Visual changes for user moves
 * @param {HTMLElement} button
 */
function visInsMoveX(btn) {
  const tip = btn.querySelector("div");
  tip.innerText = "x";
  tip.style.visibility = "visible";
  btn.removeEventListener("mouseover", showTooltip);
  btn.removeEventListener("mouseout", hideTooltip);
  btn.disabled = true;
}

/**
 * Visual changes for user moves
 * @param {HTMLElement} button
 */
function visInsMoveO(btn) {
  // viz changes
  const tip = btn.querySelector("div");
  tip.innerText = "o";
  // tip.style.visibility = "visible"
  // tip.style.marginTop = "2px"
  // tip.style.marginLeft = "-5px"
  btn.removeEventListener("mouseover", showTooltip);
  btn.removeEventListener("mouseout", hideTooltip);
  btn.disabled = true;
}

let mustLoadTurn = false

/**
 * Inserts move from user and then calls on the computer to play a move
 * @param {HTMLElement} button
 * @returns nothing except a early win
 */
async function insMove(button) {
  const index = parseInt(button.id.slice(-1));
  if (board[index] === null) {
    board[index] = turn ? "x" : "o";
    turn ? visInsMoveX(button) : visInsMoveO(button);
    if (checkGame()) {
      return;
    }
    gameBtn.innerText = "Reset";
    turn = !turn;
    turnCount++;
    // setTimeout(compMove, 300)
    await saveGameState()
    await loadGameState()
  }
}

/**
 *
 * @returns doDieRoll if draw
 */
function doDieRoll() {
  let guess1 = parseInt(
    prompt("Player X, guess the die roll (1-6):"),
    10
  );
  let guess2 = parseInt(
    prompt("Player O, guess the die roll (1-6):"),
    10
  );

  // Validate input
  if (
    isNaN(guess1) ||
    guess1 < 1 ||
    guess1 > 6 ||
    isNaN(guess2) ||
    guess2 < 1 ||
    guess2 > 6
  ) {
    alert("Invalid input. Please enter numbers between 1 and 6.");
    return doDieRoll();
  }

  // Roll the die
  const roll = Math.floor(Math.random() * 6) + 1;
  alert(`The die rolled: ${roll}`);

  // Determine who is closer
  const diff1 = Math.abs(guess1 - roll);
  const diff2 = Math.abs(guess2 - roll);

  if (diff1 < diff2) {
    alert("Player X starts!");
    turn = true; // X starts
  } else if (diff2 < diff1) {
    alert("Player O starts!");
    turn = false; // O starts
  } else {
    alert("It's a tie! Rolling again...");
    return doDieRoll();
  }
}

/**
 * Game button is the Start/Reset button that resets the state of all tooltips, turns, board, etc.
 * The start button forces the user to make their first turn
 */
function gameButton() {
  const buttons = grid.querySelectorAll("button");
  if (gameBtn.innerText[0] === "S") {
    doDieRoll();
    for (i = 0; i < buttons.length; i++) {
      //viz
      buttons[i].querySelector("div").style.visibility = "hidden";
      buttons[i].addEventListener("mouseover", showTooltip);
      buttons[i].addEventListener("mouseout", hideTooltip);
      buttons[i].disabled = false;
      updateBoard()
    }
    // setTimeout(compMove, 300)
    gameBtn.innerText = "Reset";
    mustLoadTurn = false;
  } else {
    for (i = 0; i < buttons.length; i++) {
      //viz
      const tooltip = buttons[i].querySelector("div");
      applyFormat(tooltip);
      buttons[i].disabled = true;
      buttons[i].querySelector("div").style.visibility = "hidden";
      buttons[i].removeEventListener("mouseover", showTooltip);
      buttons[i].removeEventListener("mouseout", hideTooltip);
      buttons[i].style.backgroundColor = "";
    }
    gameBtn.innerText = "Start";
    msg.innerText = "";
    //game logic
    turn = true;
    board = Array(9).fill(null);
  }
  turnCount = 0;
}

/**
 * Checks to see if the game is concluded
 * @returns true if game is finished
 */
function checkGame() {
  for (i = 0; i < winPos.length; i++) {
    const [a, b, c] = winPos[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.getElementById("tic" + a).style.backgroundColor = "red";
      document.getElementById("tic" + b).style.backgroundColor = "red";
      document.getElementById("tic" + c).style.backgroundColor = "red";
      msg.innerText = turn ? "Player X won!" : "Player O won!";
      endGame();
      return true;
    }
    if (!board.includes(null)) {
      msg.innerText = "It's a draw!";
      endGame();
      return true;
    }
  }
  return false;
}

/**
 * Ends the game by disabling all buttons once the game is finished
 */
function endGame() {
  const buttons = grid.querySelectorAll("button");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    buttons[i].removeEventListener("mouseover", showTooltip);
    buttons[i].removeEventListener("mouseout", hideTooltip);
  }
}

// BEYOND IS GAME STATE SAVES

let gameFileHandle = null; // if null, create one and keep it

/**
 * Saves game state to a json file
 *
 * @async
 */
async function saveGameState() {
  const gameState = {
    board,
    turn,
    turnCount,
  };

  if (!gameFileHandle) {
    gameFileHandle = await window.showSaveFilePicker({
      suggestedName: "ttt-state.json",
      types: [
        {
          description: "tic tac toe board state",
          accept: { "application/json": [".json"] },
        },
      ],
    });
  }

  const writable = await gameFileHandle.createWritable();
  await writable.write(JSON.stringify(gameState));
  await writable.close();
}

/**
 * Loads game state from a json file, then updates board
 *
 * @async
 */
async function loadGameState() {
  const handles = await window.showOpenFilePicker({
    types: [
      {
        description: "tic tac toe board state",
        accept: { "application/json": [".json"] },
      },
    ],
  });

  gameFileHandle = handles[0];

  const file = await gameFileHandle.getFile();
  const text = await file.text();
  const gameState = JSON.parse(text);

  board = gameState.board;
  turn = gameState.turn;
  turnCount = gameState.turnCount;

  updateBoard();
}

/**
 * Helper function to update viz changes after loading
 */
function updateBoard() {
  const buttons = grid.querySelectorAll("button");
  for (let i = 0; i < 9; i++) {
    const btn = buttons[i];
    const tip = btn.querySelector("div");
    // Always reset background color
    btn.style.backgroundColor = "";
    if (board[i] === "x") {
      tip.innerText = "x";
      tip.style.visibility = "visible";
      btn.disabled = true;
      btn.removeEventListener("mouseover", showTooltip);
      btn.removeEventListener("mouseout", hideTooltip);
    } else if (board[i] === "o") {
      tip.innerText = "o";
      tip.style.visibility = "visible";
      btn.disabled = true;
      btn.removeEventListener("mouseover", showTooltip);
      btn.removeEventListener("mouseout", hideTooltip);
    } else {
      tip.innerText = turn ? "x" : "o";
      tip.style.visibility = "hidden";
      btn.disabled = false;
      btn.addEventListener("mouseover", showTooltip);
      btn.addEventListener("mouseout", hideTooltip);
    }
  }
  msg.innerText = "";
}
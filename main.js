var board = new Array(9);

function init() {
  /* use touch events if they're supported, otherwise use mouse events */
  var down = "mousedown"; var up = "mouseup";
  if ('createTouch' in document) { down = "touchstart"; up ="touchend"; }

  /* add event listeners */
  document.querySelector("input.button").addEventListener(up, newGame, false);
  var squares = document.getElementsByTagName("td");
  for (var s = 0; s < squares.length; s++) {
    squares[s].addEventListener(down, function(evt){squareSelected(evt, getCurrentPlayer());}, false);
  }

  /* create the board and set the initial player */
  createBoard();
  setInitialPlayer();
}


function createBoard() {
  /* create a board from the stored version, if a stored version exists */
  if (window.localStorage && localStorage.getItem('tic-tac-toe-board')) {

    /* parse the string that represents our playing board to an array */
    board = (JSON.parse(localStorage.getItem('tic-tac-toe-board')));
    for (var i = 0; i < board.length; i++) {
      if (board[i] != "") {
        fillSquareWithMarker(document.getElementById(i), board[i]);
      }
    }
  }
  /* otherwise, create a clean board */
  else {
    for (var i = 0; i < board.length; i++) {
      board[i] = "";
      document.getElementById(i).innerHTML = "";
    }
  }
}

function squareSelected(evt, currentPlayer) {
  var square = evt.target;
  /* check to see if the square already contains an X or O marker */
  if (square.className.match(/marker/)) {
    alert("Sorry, that space is taken!  Please choose another square.");
    return;
  }
  /* if not already marked, mark the square, update the array that tracks our board, check for a winner, and switch players */
  else {
    fillSquareWithMarker(square, currentPlayer);
    updateBoard(square.id, currentPlayer);
    checkForWinner();
    switchPlayers();
  }
}

function fillSquareWithMarker(square, player) {
  var marker = document.createElement('div');
  /* set the class name on the new div to X-marker or O-marker, depending on the current player */
  marker.className = player + "-marker";
  square.appendChild(marker);
}

function updateBoard(index, marker) {
  board[index] = marker;

  /* HTML5 localStorage only allows storage of strings - convert our array to a string */
  var boardstring = JSON.stringify(board);

  /* store this string to localStorage, along with the last player who marked a square */
  localStorage.setItem('tic-tac-toe-board', boardstring);
  localStorage.setItem('last-player', getCurrentPlayer());
}


function declareWinner() {
  if (confirm("We have a winner!  New game?")) {
    newGame();
  }
}

function weHaveAWinner(a, b, c) {
  if ((board[a] === board[b]) && (board[b] === board[c]) && (board[a] != "" || board[b] != "" || board[c] != "")) {
    setTimeout(declareWinner(), 100);
    return true;
  }
  else
    return false;
}

function checkForWinner() {
  /* check rows */
  var a = 0; var b = 1; var c = 2;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=3; b+=3; c+=3;
  }

  /* check columns */
  a = 0; b = 3; c = 6;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=1; b+=1; c+=1;
  }

  /* check diagonal right */
  if (weHaveAWinner(0, 4, 8)) {
    return;
  }
  /* check diagonal left */
  if (weHaveAWinner(2, 4, 6)) {
    return;
  }

  /* if there's no winner but the board is full, ask the user if they want to start a new game */
  if (!JSON.stringify(board).match(/,"",/)) {
    if (confirm("It's a draw. New game?")) {
      newGame();
    }
  }
}


function getCurrentPlayer() {
  return document.querySelector(".current-player").id;
}

function setInitialPlayer() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");
  playerX.className = "";
  playerO.className = "";

  /* if there's no localStorage, or no last-player stored in localStorage, always set the first player to X by default */
  if (!window.localStorage || !localStorage.getItem('last-player')) {
    playerX.className = "current-player";
    return;
  }

  var lastPlayer = localStorage.getItem('last-player');
  if (lastPlayer == 'X') {
    playerO.className = "current-player";
  }
  else {
    playerX.className = "current-player";
  }
}

function switchPlayers() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");

  if (playerX.className.match(/current-player/)) {
    playerO.className = "current-player";
    playerX.className = "";
  }
  else {
    playerX.className = "current-player";
    playerO.className = "";
  }
}

function newGame() {
  /* clear the currently stored game out of local storage */
  localStorage.removeItem('tic-tac-toe-board');
  localStorage.removeItem('last-player');

  /* create a new game */
  createBoard();
}

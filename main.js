class Gameboard {
  constructor(board, players) {
    this.gameboard = board.getElementsByClassName("gameBoard")[0];
    this.field = this.createBoard();

    this.fieldArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.gameIsOver = false;
    this.steps = 0;

    this.renderPlayersCards(players);
  }

  // Создание поля

  createBoard = () => {
    this.gameboard.innerHTML = "";
    this.gameboard.style.display = "grid";

    for (let i = 0; i < 9; ++i) {
      let boardSquare = document.createElement("button");

      boardSquare.classList.add("square");
      boardSquare.setAttribute("player", i);
      this.gameboard.appendChild(boardSquare);
    }

    return this.gameboard.getElementsByClassName("square");
  };

  renderPlayersCards = (players) => {
    players.player1.createCard(0);
    players.player2.createCard(1);
  };

  // Игра человек X человек

  playWithPlayer = (players) => {
    let playerStep = "img/cake.svg";
    let sign = "X";

    for (let field of this.field) {
      field.onclick = () => {
        this.doStep(field, sign, playerStep);
        this.checkGameOver(players, sign);

        [playerStep, sign] = this.checkStep(sign);
      };
    }
  };

  doStep = (field, sign, signImg) => {
    if (
      field.getAttribute("player") == "O" ||
      field.getAttribute("player") == "X"
    ) {
      doStep(field, sign, signImg);
    }

    ++this.steps;
    field.style.backgroundColor = "white";
    field.style.backgroundImage = "URL(" + signImg + ")";
    field.setAttribute("player", sign);

    for (let i = 0; i < 9; ++i) {
      this.fieldArr[i] = this.gameboard.getElementsByClassName("square")[i].getAttribute("player");
    }
  };

  checkStep = (sign) => {
    if (sign == "X") {
      return ["img/cupcake.svg", "O"];
    } else {
      return ["img/cake.svg", "X"];
    }
  };

  // Игра человек X AI

  playWithAI = (players) => {
    let playerStep = "img/cake.svg";
    let signUnicorn = "X";

    for (let field of this.field) {
      field.onclick = () => {
        this.doStep(field, signUnicorn, playerStep);

        this.checkGameOver(players, "X");

        let index = this.minimax("O");
        console.log(index)
        this.doStepAI(index);

        this.checkGameOver(players, "O");
      };
    }
  };

  doStepAI = (index) => {
    ++this.steps;
    let field = this.field[index];

    field.style.backgroundColor = "white";
    field.style.backgroundImage = "URL(img/cupcake.svg)";
    field.setAttribute("player", "O");

    return true;
  };

  emptyIndexes = () => {
    return this.fieldArr.filter((s) => s != "O" && s != "X");
  };

  minimax = (sign) => {
    let emptyField = this.emptyIndexes();

    if (this.checkWinners("X")) { return -10; }
    else if (this.checkWinners("O")) { return 10; }
    else if (emptyField.length === 0) { return 0; }

    let moves = [];
    for (let i = 0; i < emptyField.length; ++i) {
      let score;
      let index = this.fieldArr[emptyField[i]];
      this.fieldArr[emptyField[i]] = sign;
      if (sign == "O") {
        score = this.minimax("X");
      } else {
        score = this.minimax("O");
      }
      this.fieldArr[emptyField[i]] = index;
      moves.push(score);
    }

    let bestMove;
    if (sign == "O") {
      let bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i] > bestScore) {
          bestScore = moves[i];
          bestMove = i;
        }
      }
    } else {
      let bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i] < bestScore) {
          bestScore = moves[i];
          bestMove = i;
        }
      }
    }

    return emptyField[bestMove];
  };

  checkGameOver = (players, sign) => {
    this.gameIsOver = this.checkWinners(sign);
    if (this.gameIsOver) this.gameOver(players, sign);
  }

  checkWinners = (sign) => {
    let board = this.field;

    if (
      (board[0].getAttribute("player") == sign &&
        board[1].getAttribute("player") == sign &&
        board[2].getAttribute("player") == sign) ||
      (board[3].getAttribute("player") == sign &&
        board[4].getAttribute("player") == sign &&
        board[5].getAttribute("player") == sign) ||
      (board[6].getAttribute("player") == sign &&
        board[7].getAttribute("player") == sign &&
        board[8].getAttribute("player") == sign) ||
      (board[0].getAttribute("player") == sign &&
        board[3].getAttribute("player") == sign &&
        board[6].getAttribute("player") == sign) ||
      (board[1].getAttribute("player") == sign &&
        board[4].getAttribute("player") == sign &&
        board[7].getAttribute("player") == sign) ||
      (board[2].getAttribute("player") == sign &&
        board[5].getAttribute("player") == sign &&
        board[8].getAttribute("player") == sign) ||
      (board[0].getAttribute("player") == sign &&
        board[4].getAttribute("player") == sign &&
        board[8].getAttribute("player") == sign) ||
      (board[2].getAttribute("player") == sign &&
        board[4].getAttribute("player") == sign &&
        board[6].getAttribute("player") == sign)
    ) {
      return true;
    }
    return false;
  };

  gameOver = (players, sign) => {
    let player1 = players.player1;
    let player2 = players.player2;
    let winner;

    if (this.steps >= 9) {
      this.gameboard.style.display = "block";
      this.gameboard.innerHTML = "Not winners!!";
      return 0;
    }

    if (player1.sign == sign) {
      winner = player1.name;
      ++player1.wins;
    } else {
      winner = player2.name;
      ++player2.wins;
    }

    this.gameboard.style.display = "block";
    this.gameboard.innerHTML = winner + " is winner!!";

    player1.createCard(0);
    player2.createCard(1);
  };
}

class Player {
  constructor(name, sign) {
    this.name = name;
    this.sign = sign;
    this.wins = 0;
  }

  createCard = (playerNum) => {
    const playerCard = document.getElementsByClassName("playerCard")[playerNum];

    playerCard.getElementsByTagName("h2")[0].innerHTML = this.name;
    playerCard.getElementsByTagName("p")[0].innerHTML = "WINS: " + this.wins;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const startButt = document.getElementById("startButt");
  const checkBox = document.getElementById("players");

  let playersForm = document.getElementsByClassName("players")[0];
  let checkedPlayers = checkPlayers(checkBox);
  let players_arr = [];
  let someName = "Some Unicorn";
  let players;
  let gameBoard;

  players_arr.push(new Player("AI", "O"));
  renderPlayersForm(playersForm, players);

  // Пользователи

  function toggleSomeName() {
    if (someName == "Some Unicorn") someName = "Maybe Unicorn";
    else someName = "Some Unicorn";
  }

  function addPlayer(newPlayerName, sign) {
    let newPlayer = new Player(newPlayerName, sign);
    players_arr.push(newPlayer);

    return newPlayer;
  }

  function checkPlayersArr(playerSt, sign) {
    let newPlayerName = document.getElementsByClassName(playerSt)[0].value || someName;
    let playerWasFind = false;
    let newPlayer;

    toggleSomeName();

    players_arr.forEach((player) => {
      if (player.name == newPlayerName) {
        newPlayer = player;
        playerWasFind = true;
      }
    });

    if (!playerWasFind) {
      newPlayer = addPlayer(newPlayerName, sign);
    }

    return newPlayer;
  }

  function createPlayers(players) {
    let player1;
    let player2;

    if (players == "AI") {
      player1 = checkPlayersArr("firstPlayer", "X");
      player2 = players_arr[0];
    } else {
      player1 = checkPlayersArr("firstPlayer", "X");
      player2 = checkPlayersArr("secondPlayer", "O");
    }

    return { player1, player2 };
  }

  // Форма для ввода имени 

  function renderPlayersForm(playersForm, players) {
    let input = document.createElement("input");
    let p = document.createElement("p");

    playersForm.innerHTML = "";

    input.classList.add("firstPlayer");
    input.type = "text";

    if (players == "AI") {
      p.innerHTML = " / AI";

      playersForm.appendChild(input);
      playersForm.appendChild(p);
    } else {
      p.innerHTML = " / ";

      playersForm.appendChild(input);
      playersForm.appendChild(p);
      input = document.createElement("input");
      input.classList.add("secondPlayer");
      playersForm.appendChild(input);
    }
  };

  function checkPlayers() {
    return checkBox.checked ? "AI" : "players";
  }

  checkBox.onclick = () => {
    checkedPlayers = checkPlayers();
    renderPlayersForm(playersForm, checkedPlayers);
  };

  ///////////////////////////////

  startButt.onclick = () => {
    let board = document.getElementsByTagName("main")[0];

    players = createPlayers(checkedPlayers);
    gameBoard = new Gameboard(board, players);

    switch (checkedPlayers) {
      case "players":
        gameBoard.playWithPlayer(players);
        break;
      case "AI":
        gameBoard.playWithAI(players);
        break;
      default:
        alert("Some Error");
    }
  };
});

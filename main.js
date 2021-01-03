const startButt = document.getElementById("startButt");
let gameOver = false;
let players_arr = [];
let someName = "Some Unicorn";

class Gameboard {
    constructor(board, players) {
        this.gameboard = board.getElementsByClassName("gameBoard")[0];
        this.field = this.createBoard();
        this.fieldArr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        this.steps = 0;
        this.renderPlayersCards(players);
        this.gameboard.style.display = "grid";
    }

    createBoard = () => {
        this.gameboard.innerHTML = "";
        let squares = 9;
        for (let i = 0; i < squares; ++i) {
            let boardSquare = document.createElement("button");

            boardSquare.classList.add("square");
            boardSquare.setAttribute("player", "");
            this.gameboard.appendChild(boardSquare);
        }

        return (this.gameboard.getElementsByClassName("square"));
    }

    renderPlayersCards = (players) => {
        players.player1.createCard(0);
        players.player2.createCard(1);
    }

    playWithPlayer = (sign, playerStep, players) => {
        for (let field of this.field) {
            field.onclick = () => {
                let step = this.doStep(field, sign, playerStep);
                gameOver = this.checkWinners(sign);

                if (gameOver) this.gameOver(players, sign);

                if (step) {
                    [playerStep, sign] = this.checkStep(playerStep);
                }
            }
        }
    }

    doStep = (field, sign, signImg) => {
        if (field.getAttribute("player") == "O" || field.getAttribute("player") == "X") {
            return false;
        }

        ++this.steps;
        field.style.backgroundColor = "white";
        field.style.backgroundImage = "URL(" + signImg + ")";
        field.setAttribute("player", sign);

        for (let i = 0; i < 9; ++i) {
            this.fieldArr[i] = this.gameboard.getElementsByClassName("square")[i].getAttribute("player");
        }

        return true;
    }

    checkStep = (playerStep) => {
        if (playerStep == "img/cake.svg") {
            return ["img/cupcake.svg", "O"];
        } else {
            return ["img/cake.svg", "X"];
        }
    }

    checkWinners = (sign) => {
        let board = this.field;

        if (
            (board[0].getAttribute("player") == sign && board[1].getAttribute("player") == sign && board[2].getAttribute("player") == sign) ||
            (board[3].getAttribute("player") == sign && board[4].getAttribute("player") == sign && board[5].getAttribute("player") == sign) ||
            (board[6].getAttribute("player") == sign && board[7].getAttribute("player") == sign && board[8].getAttribute("player") == sign) ||
            (board[0].getAttribute("player") == sign && board[3].getAttribute("player") == sign && board[6].getAttribute("player") == sign) ||
            (board[1].getAttribute("player") == sign && board[4].getAttribute("player") == sign && board[7].getAttribute("player") == sign) ||
            (board[2].getAttribute("player") == sign && board[5].getAttribute("player") == sign && board[8].getAttribute("player") == sign) ||
            (board[0].getAttribute("player") == sign && board[4].getAttribute("player") == sign && board[8].getAttribute("player") == sign) ||
            (board[2].getAttribute("player") == sign && board[4].getAttribute("player") == sign && board[6].getAttribute("player") == sign) ||
            this.steps >= 9
        ) {
            return true;
        }
        return false;
    }

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
    }

    playWithAI = (sign, playerStep) => {
        this.minimax(sign, playerStep);
    }

    doStepAI = (field, sign, signImg) => {
        console.log(field)
        field.style.backgroundColor = "white";
        field.style.backgroundImage = "URL(" + signImg + ")";
        field.setAttribute("player", sign);

        for (let i = 0; i < 9; ++i) {
            this.fieldArr[i] = this.gameboard.getElementsByClassName("square")[i].getAttribute("player");
        }

        return true;
    }

    emptyIndexes = () => {
        return this.fieldArr.filter(s => s != "O" && s != "X");
    }

    minimax = (sign, signImg) => {
        ++this.steps;
        let emtyField = this.emptyIndexes();

        if (this.checkWinners("X")) {
            return {
                score: -10
            };
        } else if (this.checkWinners("O")) {
            return {
                score: 10
            };
        } else if (emtyField.length === 0) {
            return {
                score: 0
            };
        }

        let moves = [];
        for (let i = 0; i < emtyField.length; i++) {
            let move = {};
            move.index = this.fieldArr[emtyField[i]];
            this.doStepAI(this.field[emtyField[i]], sign, signImg);

            if (sign == "X") {
                let g = this.minimax("X");
                move.score = g.score;
            } else {
                let g = this.minimax("O");
                move.score = g.score;
            }
            this.fieldArr[emtyField[i]] = move.index;
            moves.push(move);
        }

        let bestMove;
        if (sign === "O") {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
}

class Player {
    constructor(name, sign) {
        this.name = name;
        this.sign = sign;
        this.wins = 0;
    }

    createCard = (playerNum) => {
        const firstPlayerCard = document.getElementsByClassName("playerCard")[playerNum];
        firstPlayerCard.getElementsByTagName("h2")[0].innerHTML = this.name;
        firstPlayerCard.getElementsByTagName("p")[0].innerHTML = "WINS: " + this.wins;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const checkBox = document.getElementById("players");
    let playersForm = document.getElementsByClassName("players")[0];
    let checkedPlayers = checkPlayers(checkBox); // проверка второго игрока
    players_arr.push(new Player("AI", "O"));
    let players;
    let gameBoard;

    function toggleSomeName() {
        if (someName == "Some Unicorn") someName = "Maybe Unicorn";
        else someName = "Some Unicorn";
    }

    function addPlayer(newPlayerName, sign) {
        toggleSomeName();

        let newPlayer = new Player(newPlayerName, sign);
        players_arr.push(newPlayer);
        return newPlayer;
    }

    function checkPlayersArr(playerSt, sign) {
        let newPlayerName = document.getElementsByClassName(playerSt)[0].value || someName;
        let newPlayer;
        let playerWasFind = false;
        players_arr.forEach(player => {
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

    renderPlayersForm = (playersForm, players) => {
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
    }

    function checkPlayers(checkBox) {
        return checkBox.checked ? "AI" : "players";
    }

    renderPlayersForm(playersForm, checkedPlayers);

    checkBox.onclick = () => {
        checkedPlayers = checkPlayers(checkBox);
        renderPlayersForm(playersForm, checkedPlayers);
    }

    startButt.onclick = () => {
        let playerStep = "img/cake.svg";
        let sign = "X";
        let board = document.getElementsByTagName("main")[0];

        players = createPlayers(checkedPlayers);
        gameBoard = new Gameboard(board, players);

        switch (checkedPlayers) {
            case "AI": gameBoard.playWithAI(sign, playerStep); break;
            case "players": gameBoard.playWithPlayer(sign, playerStep); break;
            default: alert("Some Error");
        }
    }
});
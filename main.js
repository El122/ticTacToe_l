const startButt = document.getElementById("startButt");
let gameOver = false;
let players_arr = [];

class Gameboard {
    constructor(board, players) {
        this.gameboard = board.getElementsByClassName("gameBoard")[0];
        this.gameboard.style.display = "grid";
        this.field = this.createBoard(this.gameboard);
        this.renderPlayersCards(players);
    }

    createBoard = (gameboard) => {
        gameboard.innerHTML = "";
        let squares = 9;
        for (let i = 0; i < squares; ++i) {
            let boardSquare = document.createElement("button");

            boardSquare.classList.add("square");
            boardSquare.setAttribute("player", "");
            gameboard.appendChild(boardSquare);
        }

        return (gameboard.getElementsByClassName("square"));
    }

    renderPlayersCards = (players) => {
        players.player1.createCard(0);
        players.player2.createCard(1);
    }

    doStep = (field, sign, signImg) => {
        if (field.getAttribute("player") != "") {
            return false;
        }

        field.style.backgroundColor = "white";
        field.style.backgroundImage = "URL(" + signImg + ")";
        field.setAttribute("player", sign);

        return true;
    }

    checkStep = (playerStep) => {
        if (playerStep == "img/cake.svg") {
            return ["img/cupcake.svg", "0"];
        } else {
            return ["img/cake.svg", "X"];
        }
    }

    checkWinners = (gameBoard) => {
        if (
            (gameBoard[0].getAttribute("player") == gameBoard[1].getAttribute("player") && gameBoard[1].getAttribute("player") == gameBoard[2].getAttribute("player") ||
                gameBoard[0].getAttribute("player") == gameBoard[3].getAttribute("player") && gameBoard[3].getAttribute("player") == gameBoard[6].getAttribute("player") ||
                gameBoard[0].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[8].getAttribute("player")) && gameBoard[0].getAttribute("player") != "" ||

            (gameBoard[3].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[5].getAttribute("player") ||
                gameBoard[1].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[7].getAttribute("player") ||
                gameBoard[2].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[6].getAttribute("player")) && gameBoard[4].getAttribute("player") != "" ||

            (gameBoard[6].getAttribute("player") == gameBoard[7].getAttribute("player") && gameBoard[7].getAttribute("player") == gameBoard[8].getAttribute("player") ||
                gameBoard[2].getAttribute("player") == gameBoard[5].getAttribute("player") && gameBoard[5].getAttribute("player") == gameBoard[8].getAttribute("player")) && gameBoard[8].getAttribute("player") != ""
        ) {
            return true;
        }
        return false;
    }

    gameOver = (players, sign) => {
        let player1 = players.player1;
        let player2 = players.player2;
        let winner;

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
        player1.createCard(1);
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
function checkPlayersArr(playerName) {
    players_arr.forEach(player => {
        if (player == playerName) return player;
    });

    return false;
}

// function addPlayer() {

// }

function createPlayers(players) {
    let playerName;
    let player1;
    let player2;

    if (players == "AI") {
        playerName = document.getElementsByClassName("firstPlayer")[0].value || "Some Unicorn";

        if (!checkPlayersArr(playerName)) {
            players_arr.push(new Player(playerName, "X"));
        }

        player1 = checkPlayersArr(playerName);

        playerName = "AI";

        if (!checkPlayersArr(playerName)) {
            players_arr.push(new Player(playerName, "0"));
        }

        player2 = checkPlayersArr(playerName);
    } else {
        playerName = document.getElementsByClassName("firstPlayer")[0].value || "Some Unicorn";
        if (!checkPlayersArr(playerName)) {
            players_arr.push(new Player(playerName, "X"));
        }
        player1 = checkPlayersArr(playerName) || new Player(playerName, "X");

        playerName = document.getElementsByClassName("secondPlayer")[0].value || "Maybe Unicorn";
        if (!checkPlayersArr(playerName)) {
            players_arr.push(new Player(playerName, "0"));
        }
        player2 = checkPlayersArr(playerName) || new Player(playerName, "0");
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

document.addEventListener("DOMContentLoaded", () => {
    const checkBox = document.getElementById("players")

    let playersForm = document.getElementsByClassName("players")[0];
    let checkedPlayers = checkPlayers(checkBox); // проверка второго игрока
    let playerStep = "img/cake.svg";
    let sign = "X";
    let players;
    let gameBoard;

    renderPlayersForm(playersForm, checkedPlayers);

    checkBox.onclick = () => {
        checkedPlayers = checkPlayers(checkBox);
        renderPlayersForm(playersForm, checkedPlayers);
    }

    startButt.onclick = () => {
        let board = document.getElementsByTagName("main")[0];

        players = createPlayers(checkedPlayers);
        gameBoard = new Gameboard(board, players);

        for (let field of gameBoard.field) {
            field.onclick = () => {
                let step = gameBoard.doStep(field, sign, playerStep);
                gameOver = gameBoard.checkWinners(gameBoard.field);

                if (gameOver) gameBoard.gameOver(players, sign);

                if (step) {
                    [playerStep, sign] = gameBoard.checkStep(playerStep);
                }
            }
        }
    }
});
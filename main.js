const startButt = document.getElementById("startButt");
let gameOver = false;
let players_arr = [];
let someName = "Some Unicorn";
let steps = 0;

class Gameboard {
    constructor(board, players) {
        this.gameboard = board.getElementsByClassName("gameBoard")[0];
        this.gameboard.style.display = "grid";
        this.field = this.createBoard();
        this.renderPlayersCards(players);
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

    doStep = (field, sign, signImg) => {
        if (field.getAttribute("player") != "") {
            return false;
        }

        ++steps;
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

    checkWinners = (gameBoard, steps) => {
        if (
            (gameBoard[0].getAttribute("player") == gameBoard[1].getAttribute("player") && gameBoard[1].getAttribute("player") == gameBoard[2].getAttribute("player") ||
                gameBoard[0].getAttribute("player") == gameBoard[3].getAttribute("player") && gameBoard[3].getAttribute("player") == gameBoard[6].getAttribute("player") ||
                gameBoard[0].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[8].getAttribute("player")) && gameBoard[0].getAttribute("player") != "" ||

            (gameBoard[3].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[5].getAttribute("player") ||
                gameBoard[1].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[7].getAttribute("player") ||
                gameBoard[2].getAttribute("player") == gameBoard[4].getAttribute("player") && gameBoard[4].getAttribute("player") == gameBoard[6].getAttribute("player")) && gameBoard[4].getAttribute("player") != "" ||

            (gameBoard[6].getAttribute("player") == gameBoard[7].getAttribute("player") && gameBoard[7].getAttribute("player") == gameBoard[8].getAttribute("player") ||
                gameBoard[2].getAttribute("player") == gameBoard[5].getAttribute("player") && gameBoard[5].getAttribute("player") == gameBoard[8].getAttribute("player")) && gameBoard[8].getAttribute("player") != "" ||
            steps >= 9
        ) {
            return true;
        }
        return false;
    }

    gameOver = (players, sign, steps) => {
        let player1 = players.player1;
        let player2 = players.player2;
        let winner;

        if (steps >= 9) {
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
    players_arr.push(new Player("AI", "0"));
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
            player2 = checkPlayersArr("secondPlayer", "0");
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
        steps = 0;

        players = createPlayers(checkedPlayers);
        gameBoard = new Gameboard(board, players);

        for (let field of gameBoard.field) {
            field.onclick = () => {
                let step = gameBoard.doStep(field, sign, playerStep);
                gameOver = gameBoard.checkWinners(gameBoard.field, steps);

                if (gameOver) gameBoard.gameOver(players, sign, steps);

                if (step) {
                    [playerStep, sign] = gameBoard.checkStep(playerStep);
                }
            }
        }
    }
});
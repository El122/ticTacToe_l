const startButt = document.getElementById("startButt");
const checkBox = document.getElementById("players")

class Gameboard {
    constructor(board, players) {
        let gameboard = board.getElementsByClassName("gameBoard")[0];

        this.createBoard(gameboard);
    }

    createBoard = (gameboard) => {
        gameboard.innerHTML = "";
        let squares = 9;
        for (let i = 0; i < squares; ++i) {
            let boardSquare = document.createElement("div");

            boardSquare.classList.add("square");
            gameboard.appendChild(boardSquare);
        }
    }
}

class Player {
    constructor(name) {
        this.name = name;
        // this.sign = sign;
    }
}

renderPlayersForm = (playersForm, players) => {
    playersForm.innerHTML = "";
    let input = document.createElement("input");
    input.classList.add("firstPlayer");
    let p = document.createElement("p")
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

function checkPlayers() {
    let playersForm = document.getElementsByClassName("players")[0];
    let players = checkBox.checked ? "AI" : "players";

    renderPlayersForm(playersForm, players);

    return players;
}

function createPlayers(players) {
    let playerName;
    let player1;
    let player2;

    if (players == "AI") {
        playerName = document.getElementsByClassName("firstPlayer")[0].value || "Some Human";
        player1 = new Player(playerName);

        playerName = "AI";
        player2 = new Player(playerName);
    }
    // else {
    //     playerName = document.getElementsByClassName("firstPlayer")[0].value || "Some Human";
    //     player1 = new Player(playerName);

    //     playerName = document.getElementsByClassName("secondPlayer")[0].value || "Maybe Human";
    //     player2 = new Player(playerName);
    // }

    console.log(player1 + " " + player2);

    // if (player1 != "" && player2 != "") {
    //     return { player1, player2 };
    // }

    // return createPlayers(players);
}

document.addEventListener("DOMContentLoaded", () => {
    let players = checkPlayers();

    checkBox.onclick = () => {
        players = checkPlayers();
    }

    startButt.onclick = () => {
        let board = document.getElementsByTagName("main")[0];
        players = createPlayers(players);
        let gameBoard = new Gameboard(board, players);
    }
})
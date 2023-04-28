// Gameboard module
const Gameboard = (() => {
    const board = 
    [
        "","","",
        "","","",
        "","",""
    ];
    const addMark = (squareIndex, player) => {
        board[squareIndex] = player
    }
    return { board, addMark }
})()

// createPlayer factory function
const createPlayer = (name, marker) => {
    return {name, marker}
}

// Game controller module
const Game = () => {
    const _player1 = createPlayer("player1", "x")
    const _player2 = createPlayer("player2", "o")
    let _currentPlayer = _player1
    let isFinished = false
    const playTurn = (squareIndex) => {
        Gameboard.addMark(squareIndex, getCurrentPlayer().marker);
        checkWin()
        switchPlayer()
    }
    const switchPlayer = () => {
        _currentPlayer = _currentPlayer === _player1 ? _player2 : _player1
    }
    const getCurrentPlayer = () => _currentPlayer
    const checkWin = () => {
        if(Gameboard.board[0] === _currentPlayer.marker &&
            Gameboard.board[1] === _currentPlayer.marker &&
            Gameboard.board[2] === _currentPlayer.marker ||
            Gameboard.board[3] === _currentPlayer.marker &&
            Gameboard.board[4] === _currentPlayer.marker &&
            Gameboard.board[5] === _currentPlayer.marker ||
            Gameboard.board[6] === _currentPlayer.marker &&
            Gameboard.board[7] === _currentPlayer.marker &&
            Gameboard.board[8] === _currentPlayer.marker ||

            Gameboard.board[0] === _currentPlayer.marker &&
            Gameboard.board[3] === _currentPlayer.marker &&
            Gameboard.board[6] === _currentPlayer.marker ||
            Gameboard.board[1] === _currentPlayer.marker &&
            Gameboard.board[4] === _currentPlayer.marker &&
            Gameboard.board[7] === _currentPlayer.marker ||
            Gameboard.board[2] === _currentPlayer.marker &&
            Gameboard.board[5] === _currentPlayer.marker &&
            Gameboard.board[8] === _currentPlayer.marker ||

            Gameboard.board[0] === _currentPlayer.marker &&
            Gameboard.board[4] === _currentPlayer.marker &&
            Gameboard.board[8] === _currentPlayer.marker ||
            Gameboard.board[2] === _currentPlayer.marker &&
            Gameboard.board[4] === _currentPlayer.marker &&
            Gameboard.board[6] === _currentPlayer.marker
            ) {
            console.log(`${_currentPlayer.name} wins`)
            finishGame()
            console.log(isFinished)
        } else if(Gameboard.board.filter(mark => mark === "").length === 0){
            console.log("Game is a tie!")
            finishGame()
        }
    }
    const finishGame = () => {
        console.log("finished")
        isFinished = true
    }
    const checkFinished = () => isFinished

    return { playTurn, getCurrentPlayer, checkWin, checkFinished }
}

//Screen controller module for DOM
const ScreenController = (() => {
    const container = document.getElementById("game-board")
    const game = Game()
    const createBoard = () => {
        for(let i = 0; i<9; i++){
        const square = document.createElement("div")
        square.classList.add("square")
        container.append(square)
        }
        render()
    }
    const render = ()=> {
        Gameboard.board.forEach((marker, index)=> {
            container.childNodes[index].textContent = marker
        })
    }
    //Start game
    const startBtn = document.getElementById("btn-start")
    startBtn.addEventListener("click", (e)=> {
        createBoard();
        let btn = e.target;
        btn.remove();
    })
    //Add marks to the squares
    container.addEventListener("click", (e)=> {
        let squareIndex = Array.from(container.childNodes).indexOf(e.target)
        if(Gameboard.board[squareIndex] === "" && game.checkFinished() === false) {
            game.playTurn(squareIndex)
            render()
        }
    })
})()

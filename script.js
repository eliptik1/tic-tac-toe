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
        const combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for (let i = 0; i < combinations.length; i++) {
            if(Gameboard.board[combinations[i][0]] === _currentPlayer.marker && 
                Gameboard.board[combinations[i][1]] === _currentPlayer.marker &&
                Gameboard.board[combinations[i][2]] === _currentPlayer.marker){
                console.log(`${_currentPlayer.name} wins`)
                finishGame()
            }
        }
        if(Gameboard.board.filter(mark => mark === "").length === 0 && !isFinished){
            console.log("Game is a tie!")
            finishGame()
        }
    }
    const finishGame = () => {
        console.log("finished")
        isFinished = true
    }
    const checkFinished = () => isFinished
    const restartGame = () => {
        for(let i = 0 ; i < Gameboard.board.length; i ++){
            Gameboard.board[i] = ""
        }
        _currentPlayer = _player1
        isFinished = false
    }
    return { playTurn, getCurrentPlayer, checkWin, checkFinished, restartGame }
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
    const restartBtn = document.getElementById("btn-restart")
    startBtn.addEventListener("click", (e)=> {
        createBoard();
        let btn = e.target;
        btn.remove();
        container.classList.remove("hidden")
        restartBtn.classList.remove("hidden")
    })
    //Restart game
    restartBtn.addEventListener("click", ()=> {
        game.restartGame();
        render();
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

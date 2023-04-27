
const container = document.getElementById("game-board")

// Gameboard module
const Gameboard = (() => {
    const board = 
    [
        "","","",
        "","","",
        "","",""
    ];
    
    const createBoard = () => {
        for(let i = 0; i<9; i++){
        const square = document.createElement("div")
        square.classList.add("square")
        container.append(square)
        }
        render()
    }
    const render = ()=> {
        board.forEach((marker, index)=> {
            container.childNodes[index].textContent = marker
        })
    }
    return { board, createBoard, render }
})()

//Start game
const startBtn = document.getElementById("btn-start")
startBtn.addEventListener("click", (e)=> {
    Gameboard.createBoard();
    Game.playTurn();
    let btn = e.target;
    btn.remove();
})

// createPlayer factory function
const createPlayer = (name, marker) => {
    return {name, marker}
}

// Game controller module
const Game = (() => {
    const _player1 = createPlayer("player1", "x")
    const _player2 = createPlayer("player2", "o")
    let _currentPlayer = _player1
    
    const playTurn = () => {
        container.addEventListener("click", (e)=> {
            let squareIndex = Array.from(container.childNodes).indexOf(e.target)
            if(Gameboard.board[squareIndex] === "") {
                Gameboard.board[squareIndex] = _currentPlayer.marker
                switchPlayer()
            }
            Gameboard.render()
        })
    }

    const switchPlayer = () => {
        _currentPlayer = _currentPlayer === _player1 ? _player2 : _player1
    }
    return { playTurn }
})()

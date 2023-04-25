// Gameboard module
const Gameboard = (() => {
    const board = 
    [
        0,0,0,
        0,0,0,
        0,0,0
    ];
    const container = document.getElementById("game-board")
    const createBoard = () => {
        for(let i = 0; i<9; i++){
        const square = document.createElement("div")
        square.classList.add("square")
        container.append(square)
        }
    }
    const render = ()=> {
        board.forEach((marker, index)=> {
            container.childNodes[index].textContent = marker
        })
    }
    return { board, createBoard, render }
})()

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
        // playTurn function
        console.log("played")
        switchPlayer()
    }
    const switchPlayer = () => {
        // switch function
    }
    return { playTurn }
})()

// Gameboard module
const Gameboard = (() => {
    const board = [0,0,0,0,0,0,0,0,0];
    return { board }
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

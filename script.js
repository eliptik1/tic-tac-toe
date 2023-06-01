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
const Game = (gameMode) => {
    const playerName1 = document.querySelector("#player1").value
    const playerName2 = document.querySelector("#player2").value
    let playerOneMarker = document.querySelector(`input[name="marker"]:checked`).value
    let playerTwoMarker = document.querySelector(`input[name="marker"]:not(:checked)`).value
    let _player1 = createPlayer(playerName1, playerOneMarker)
    let _player2 = createPlayer(playerName2, playerTwoMarker)
    if(gameMode === "PVP") {
        _player2 = createPlayer(playerName2, playerTwoMarker)
    }
    if(gameMode === "PVC" || gameMode === "PVC-hard") {
        _player1 = createPlayer(playerName1, playerOneMarker)
        _player2 = createPlayer("Computer", playerTwoMarker)
    }
    let _currentPlayer = _player1
    let isFinished = false
    let legalMoves = [0,1,2,3,4,5,6,7,8]
    const playTurn = (squareIndex) => {
        if(gameMode === "PVP"){
            Gameboard.addMark(squareIndex, getCurrentPlayer().marker);
            checkWin(_currentPlayer)
            switchPlayer()
        }
        if(gameMode === "PVC") {
            legalMoves = legalMoves.filter(item => item != squareIndex)
            let randomIndex = legalMoves[Math.floor(Math.random()*legalMoves.length)]
            if(squareIndex === undefined) { //if we choose "O" and start/restart game, computer starts first without a squareIndex
                switchPlayer()
                Gameboard.addMark(randomIndex, getCurrentPlayer().marker)
                legalMoves = legalMoves.filter(item => item != randomIndex)
                checkWin(_currentPlayer)
                switchPlayer()
                computerPlays = false
            } else {
                Gameboard.addMark(squareIndex, getCurrentPlayer().marker);
                computerPlays = true
                checkWin(_currentPlayer)
                switchPlayer()
                if(isFinished === true) return
                setTimeout(()=> {
                    Gameboard.addMark(randomIndex, getCurrentPlayer().marker)
                    legalMoves = legalMoves.filter(item => item != randomIndex)
                    checkWin(_currentPlayer)
                    switchPlayer()
                    computerPlays = false
                }, 300)
            }
        }
        if(gameMode === "PVC-hard") {
            if(squareIndex === undefined){
                playMove(0, _player2)
                return
            }
            legalMoves = legalMoves.filter(item => item != squareIndex)
            playMove(squareIndex, _player1)
            function playMove(squareIndex, player) {
                Gameboard.addMark(squareIndex, player.marker);
                ScreenController.render()
                if(winning(Gameboard.board, player) && player.marker === "X") {
                    checkWin(_player1)
                } else if(Gameboard.board.filter(mark => mark === "").length === 0){
                    checkWin(_currentPlayer)
                } else {
                    let minimaxIndex = minimax(Gameboard.board, _player2).index
                    Gameboard.addMark(minimaxIndex, _player2.marker);
                    legalMoves = legalMoves.filter(item => item != minimaxIndex)
                    checkWin(_player2)
                    ScreenController.render()
                    if(winning(Gameboard.board, _player2)){
                        checkWin(_player2)
                    }
                }
            }

            //Minimax algorithm
            function minimax(newBoard, player){
                let availableSquares = legalMoves
                if(winning(newBoard, _player1)){
                    return {score: 10}
                } else if(winning(newBoard, _player2)){
                    return {score: -10}
                } else if(legalMoves.length === 0) {
                    return {score: 0}
                }
                let moves = []
                for(let i = 0; i < availableSquares.length; i++){
                    let move = {}
                    move.index = availableSquares[i]
                    Gameboard.addMark(move.index, player.marker); //place the player's marker
                    legalMoves = legalMoves.filter(item => item != move.index)
                    if(player === _player1){
                        let result = minimax(newBoard, _player2)
                        move.score = result.score
                    } else if(player === _player2){
                        let result = minimax(newBoard, _player1)
                        move.score = result.score
                    }
                    newBoard[availableSquares[i]] = "" // reset the board squares
                    legalMoves.push(availableSquares[i])
                    moves.push(move)
                }
                let bestMove 
                if(player === _player1){
                    let bestScore = -10000
                    for(let i = 0; i < moves.length; i++){
                        if(moves[i].score > bestScore){
                            bestScore = moves[i].score
                            bestMove = i
                        }
                    }
                } else {
                    let bestScore = 10000
                    for(let i = 0; i < moves.length; i++){
                        if(moves[i].score < bestScore){
                            bestScore = moves[i].score
                            bestMove = i
                        }
                    }
                }
                return moves[bestMove]
            }
        }
    }
    const switchPlayer = () => {
        _currentPlayer = _currentPlayer === _player1 ? _player2 : _player1
    }
    const getCurrentPlayer = () => _currentPlayer

    //winning combinations
    const combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    function winning(board, player) {
        for (let i = 0; i < combinations.length; i++) {
            if(board[combinations[i][0]] === player.marker && 
                board[combinations[i][1]] === player.marker &&
                board[combinations[i][2]] === player.marker){
                return true
                }
            }
        return false
    }
    const checkWin = (player) => {
        for (let i = 0; i < combinations.length; i++) {
            if(Gameboard.board[combinations[i][0]] === player.marker && 
                Gameboard.board[combinations[i][1]] === player.marker &&
                Gameboard.board[combinations[i][2]] === player.marker){
                winner = player
                finishGame(`${winner.name} wins!`)
                getWinIndexes(combinations[i][0], combinations[i][1], combinations[i][2])
            }
        }
        if(Gameboard.board.filter(mark => mark === "").length === 0 && !isFinished){
            isTie = true
            finishGame("Game is a tie!")
        }
        ScreenController.render()
    }
    let getWinIndexes = (a, b, c) => {
        winArr = [a,b,c]
    }
    let msg
    let winner
    let isTie = false
    let winArr
    let computerPlays = false
    const finishGame = (message) => {
        isFinished = true
        msg = message
    }
    const checkGameMode = () => gameMode
    const checkComputerTurn = () => computerPlays
    const getWinner = () => isTie ? isTie : winner
    const getWinArr = () => winArr
    const checkTieStatus = () => isTie
    const getMessage = () => msg
    const clearMessage = () => msg = ""
    const checkFinished = () => isFinished
    const restartGame = () => {
        for(let i = 0 ; i < Gameboard.board.length; i ++){
            Gameboard.board[i] = ""
        }
        isFinished = false
        isTie = false
    }
    return { playerOneMarker, playerTwoMarker, checkGameMode, checkComputerTurn, playTurn, checkFinished, checkWin, restartGame, getWinner, getWinArr, checkTieStatus, getMessage, clearMessage }
}

//Screen controller module for DOM
const ScreenController = (() => {
    const container = document.getElementById("game-board")
    const result = document.querySelector(".result")
    let game = Game()
    let boardCreated = false
    const createBoard = () => {
        for(let i = 0; i<9; i++){
        const square = document.createElement("div")
        square.classList.add("square")
        container.append(square)
        }
        container.childNodes[0].classList.add("tl-border")
        container.childNodes[1].classList.add("t-border")
        container.childNodes[2].classList.add("tr-border")
        container.childNodes[3].classList.add("l-border")
        container.childNodes[5].classList.add("r-border")
        container.childNodes[6].classList.add("bl-border")
        container.childNodes[7].classList.add("b-border")
        container.childNodes[8].classList.add("br-border")
        render()
        boardCreated = true
    }
    const render = ()=> {
        removeColors() //there is a color bug without this when playing with "O" against computer
        Gameboard.board.forEach((marker, index)=> {
            container.childNodes[index].textContent = marker
            //Add marker colors
            if(Gameboard.board[index] === game.playerOneMarker) container.childNodes[index].classList.add("color1");
            if(Gameboard.board[index] === game.playerTwoMarker) container.childNodes[index].classList.add("color2");
        })
        if(game.checkFinished()) {
            if (game.checkTieStatus() === false) game.getWinArr().forEach(index => container.childNodes[index].classList.add("squareWin"))
            result.textContent = `${game.getMessage()}`
            if(game.getWinner() === true) result.style.color = "rgb(29, 66, 118)"
            if(game.getWinner().marker === game.playerOneMarker) result.classList.add("color1")
            if(game.getWinner().marker === game.playerTwoMarker) result.classList.add("color2")
        } else {
            result.textContent = `${game.clearMessage()}`
        }
    }
    const removeColors = () => {
        container.childNodes.forEach(square => {
            square.classList.remove("color1")
            square.classList.remove("color2")
            result.classList.remove("color1")
            result.classList.remove("color2")
            result.style.color = ""
            square.classList.remove("squareWin")
        })
    }
    //Start game
    const startBtn = document.getElementById("btn-start")
    const startBotBtn = document.getElementById("btn-start-bot")
    const startBotHardBtn = document.getElementById("btn-start-bot-hard")
    const restartBtn = document.getElementById("btn-restart")
    const exitBtn = document.getElementById("btn-exit")
    const title = document.querySelector(".title")
    const pvpTitle = document.querySelector(".pvp-title")
    const players = document.querySelector(".players")
    startBtn.addEventListener("click", ()=> {
        toggleButtons()
        game = Game("PVP") // re-assign the variable for updating playerName1 and playerName2
        if(boardCreated === false) createBoard()
    })
    startBotBtn.addEventListener("click", ()=> {
        toggleButtons()
        game = Game("PVC")
        if(boardCreated === false) createBoard()
        if(game.playerOneMarker === "O") game.playTurn() // if we (Player1) choose "O", computer ("X") plays first
    })
    startBotHardBtn.addEventListener("click", ()=> {
        toggleButtons()
        game = Game("PVC-hard")
        if(boardCreated === false) createBoard()
        if(game.playerOneMarker === "O") game.playTurn()
    })
    const toggleButtons = () => {
        startBtn.classList.toggle("hidden")
        startBotBtn.classList.toggle("hidden")
        startBotHardBtn.classList.toggle("hidden")
        container.classList.toggle("hidden")
        restartBtn.classList.toggle("hidden")
        exitBtn.classList.toggle("hidden")
        title.classList.toggle("hidden")
        pvpTitle.classList.toggle("hidden")
        players.classList.toggle("hidden")
    }
    //Restart game
    restartBtn.addEventListener("click", ()=> {
        if(game.checkGameMode() === "PVP") game = Game("PVP")
        if(game.checkGameMode() === "PVC") game = Game("PVC")
        if(game.checkGameMode() === "PVC-hard") game = Game("PVC-hard")
        game.restartGame();
        render();
        removeColors();
        if(game.checkGameMode() === "PVC" && game.playerOneMarker === "O") game.playTurn() // if we (Player1) choose "O", computer ("X") plays first
        if(game.checkGameMode() === "PVC-hard" && game.playerOneMarker === "O") game.playTurn()
    })
    //Back to menu
    exitBtn.addEventListener("click", ()=> {
        game.restartGame();
        toggleButtons()
        render();
        removeColors();
    })
    //Add marks to the squares
    container.addEventListener("click", (e)=> {
        let squareIndex = Array.from(container.childNodes).indexOf(e.target)
        if(Gameboard.board[squareIndex] === "" && game.checkFinished() === false && game.checkComputerTurn() === false) {
            game.playTurn(squareIndex)          
        }
    })
    return {render}
})()

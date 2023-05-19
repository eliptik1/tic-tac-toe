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
            checkWin()
            switchPlayer()
            ScreenController.render()
        }
        if(gameMode === "PVC") {
            legalMoves = legalMoves.filter(item => item != squareIndex)
            let randomIndex = legalMoves[Math.floor(Math.random()*legalMoves.length)]
            if(squareIndex === undefined) { //if we choose "O" and start/restart game, computer starts first without a squareIndex
                switchPlayer()
                Gameboard.addMark(randomIndex, getCurrentPlayer().marker)
                legalMoves = legalMoves.filter(item => item != randomIndex)
                checkWin()
                switchPlayer()
                ScreenController.render()
                computerPlays = false
            } else {
                Gameboard.addMark(squareIndex, getCurrentPlayer().marker);
                computerPlays = true
                checkWin()
                switchPlayer()
                ScreenController.render()
                if(isFinished === true) return
                setTimeout(()=> {
                    Gameboard.addMark(randomIndex, getCurrentPlayer().marker)
                    legalMoves = legalMoves.filter(item => item != randomIndex)
                    checkWin()
                    switchPlayer()
                    ScreenController.render()
                    computerPlays = false
                }, 300)
            }
        }
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
                winner = _currentPlayer
                finishGame(`${winner.name} wins!`)
                getWinIndexes(combinations[i][0], combinations[i][1], combinations[i][2])
            }
        }
        if(Gameboard.board.filter(mark => mark === "").length === 0 && !isFinished){
            isTie = true
            finishGame("Game is a tie!")
        }
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
    return { playerOneMarker, playerTwoMarker, checkGameMode, checkComputerTurn, playTurn, checkFinished, restartGame, getWinner, getWinArr, checkTieStatus, getMessage, clearMessage }
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
        game.restartGame();
        render();
        removeColors();
        if(game.checkGameMode() === "PVC" && game.playerOneMarker === "O") game.playTurn() // if we (Player1) choose "O", computer ("X") plays first
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

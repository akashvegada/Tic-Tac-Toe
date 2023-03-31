let currentTurn = "cross";
const cross = document.querySelector(".cross");
const circle = document.querySelector(".circle");
const hideClass = document.querySelector(".hide");
const cellsDiv = document.getElementsByClassName("cell");
const turnSpan = document.querySelector(".info").getElementsByTagName("h2")[0];
const startButton = document.querySelector(".start-btn");

const tickSound = new Audio("tick.mov");
const startGameSound = new Audio("start-game.wav")
const errorSound = new Audio("error.wav")
const gameWinSound = new Audio("game-win.wav");

let gameStarted = false;
let moves = 0;
const winIndex = [["0","1","2"], ["3","4","5"], ["6","7","8"], ["0","3","6"], ["1","4","7"], ["2","5","8"], ["0","4","8"], ["2","4","6"]];
const indexOfX = new Set();
const indexOfO = new Set();


// Varibalbes to store current cell and clicked index value
let cellContents, clickedIndex;


startButton.addEventListener('click',()=>{
    startButton.style.display = "none";
    startGameSound.play();
    setGame();
});

function setGame(){
    moves = 0;
    gameStarted = true;
    currentTurn = "cross";
    // Clearing all the previous game's moves
    indexOfO.forEach((e)=>{
        cellsDiv[e].querySelector(".circle").classList.add("hide");
        cellsDiv[e].classList.remove("highlight");
    });

    indexOfX.forEach((e)=>{
        cellsDiv[e].querySelector(".cross").classList.add("hide");
        cellsDiv[e].classList.remove("highlight");
    })

    indexOfO.clear();
    indexOfX.clear();

    turnSpan.innerHTML = "X's turn";
}

for(let i=0; i<cellsDiv.length; i++){
    // console.log(cells[i]);
    cellsDiv[i].addEventListener('click', ()=>{
        if(gameStarted){
            clickedIndex = cellsDiv[i].dataset.index;
            // console.log(clickedIndex)
            cellContents = cellsDiv[i].querySelector("."+currentTurn);
            if(indexOfO.has(clickedIndex) || indexOfX.has(clickedIndex)){
                errorSound.play();
            }
            else if(cellContents.classList.contains("hide")){
                moves++;
                tickSound.play();
                cellContents.classList.remove("hide");
                if(currentTurn=="cross"){
                    turnSpan.innerHTML = "O's turn";
                    currentTurn = "circle";
                    indexOfX.add(clickedIndex);
                }
                else{
                    turnSpan.innerHTML = "X's turn";
                    currentTurn = "cross";
                    indexOfO.add(clickedIndex);
                }
                let winner = checkWinner();
                if(moves > 8 && winner=="none"){
                    errorSound.play();
                    turnSpan.innerHTML = "It's a Draw!";
                    startButton.style.display = "block";
                    startButton.innerHTML = "Play Again";
                    // setGame();  

                }
                if(winner!="none"){
                    gameWinSound.play();
                    gameStarted = false;
                    startButton.style.display = "block";
                    startButton.innerHTML = "Play Again";
                    document.querySelector(".info").getElementsByTagName("h2")[0].innerHTML = winner+" wins!";
                }
            }
        }
        else{
            errorSound.play();
            startButton.style.animation = "shakeAnimation 500ms linear";
            setTimeout(()=>{
                startButton.style.animation = "none";
            },500);
        }
    });
}


function checkWinner(){
    if(moves < 5){
        return "none";
    }
    for(let i=0;i<winIndex.length;i++){
        // console.log("Checking", winIndex[i][0], winIndex[i][1], winIndex[i][2]);
        if(indexOfX.has(winIndex[i][0]) && indexOfX.has(winIndex[i][1]) && indexOfX.has(winIndex[i][2])){
            for(let j=0;j<3;j++){
                document.querySelector(`[data-index = "`+winIndex[i][j]+`"]`).classList.add("highlight");
            }
            return "X";
        }
        if(indexOfO.has(winIndex[i][0]) && indexOfO.has(winIndex[i][1]) && indexOfO.has(winIndex[i][2])){
            // console.log("here2");
            for(let j=0;j<3;j++){
                document.querySelector(`[data-index = "`+winIndex[i][j]+`"]`).classList.add("highlight");
            }
            return "O";
        }
    }
    return "none"
}
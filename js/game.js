'use strict'

 ////////////////////////////////////////////////////////////
//LAST-VERSION - The Game is still in the process of work!//
////////////////////////////////////////////////////////////


const MINE = '💥';
const EMPTY = ' ';
const MARK = '❌';

var firstClick = false;
var gGameInterval;
var gameIsOn = true;
var gBoard;
var cellIsNumber;
var clicksCounter = 0;
var totalSeconds = 0;
var minesCounter = 0;
var gNumbersCount = 0;
var cellPushedCount = 0;
var minesTotal = 2;
var gMarkTotal = minesTotal;
var gNumsTotal = 0 - minesTotal;
var shownCellsTotal = 0;
var gLifeTotal = 2;
var gTimer = 0;
var gBoardSize = 4;

///////////////////////////////
var gBoard1 = buildBoard(4, 4);
var gBoard2 = buildBoard(8, 8);
var gBoard3 = buildBoard(12, 12);

//////////////////////////////
var gLevel1 = { size: 4, mines: 2 };
var gLevel2 = { size: 8, mines: 12 };
var gLevel3 = { size: 12, mines: 30 };

/////////////////////////////

// UNIT-TESTING//


function initGame() {
    gLifeTotal = 2;
    restartGame();
    gBoard = buildBoard(gBoardSize, gBoardSize)
    setMines(gBoard, minesTotal)
    renderBoard(gBoard)
    isAlive()
}

//builds the board 
function buildBoard(rowsCount, colsCount) {
    var board = [];
    for (var i = 0; i < rowsCount; i++) {
        board[i] = [];
        for (var j = 0; j < colsCount; j++) {
            var cell = createCell()
            board[i][j] = cell;
        }
        gNumsTotal++
    }
    // console.log(board)
    return board;
}

//Renders it To DOM
function renderBoard(board) {
    var strHTML = '';
    var cellCont;

    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {


            var className = ` cell-${i}-${j}`;
            if (gBoard[i][j].isMine) {
                cellCont = MINE;
                className += ' mine';
            }
            else if (!gBoard[i][j].isMine) {
                var num = setMinesNegsCount(board, i, j)
                cellCont = num;
                gBoard[i][j].minesAroundCount = num;
            }
            if (!gBoard[i][j].isShown) {
                cellCont = '';
            }
            if (gBoard[i][j].isShown) {
                className += ' shown'
            }
            if (gBoard[i][j].isMarked && gBoard[i][j].isShown) {
                cellCont = MARK;
            }


            // console.log(gGame.shownCount)

            strHTML += `\t<td class="cell${className}" 
            onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this,${i},${j});" style="height:35px;width:35px">${cellCont}
            </td>\n`
            // console.log(className);
        }
        strHTML += `</tr>\n`

    }
    // console.log(strHTML)
    var elCells = document.querySelector('.game-board');
    elCells.innerHTML = strHTML;
}

// Describes what happens when user clicks on board and expose the cells
function cellClicked(elCell, i, j) {
    var firstClick = false;
    if (!gameIsOn & firstClick) firstClick = true;

    if (firstClick) gBoard[i][j].isMine = false;

    if (gBoard[i][j].isShown) return;

    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown;
        document.querySelector('.smiley').innerText = '🥴';
        gLifeTotal--;
        isAlive();
        gBoard[i][j].isShown
        if (gLifeTotal === 0) {
            gameOver()
            return;
        }
    }
    // console.log(gLifeTotal);
    clicksCounter++;
    if (clicksCounter === 1) {
        !gBoard[i][j].isMine;
        gGameInterval = setInterval(setTimer, 1000);
    }
    if (gBoard[i][j].minesAroundCount === 0) {
        expandedCells(i, j)
    }
    gBoard[i][j].isShown = true;
    elCell.classList.add('shown');
    renderBoard(gBoard);

    if (gMarkTotal === 0 && !gBoard[i][j].isMine || gNumsTotal === shownCellsTotal) { winGame(); }

}

//works with left click and than a right click - haven't finished it
function cellMarked(elCell, i, j) {
    if (!gameIsOn) return;
    if (gBoard[i][j].isShown) return;

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        gMarkTotal++;
    } else {
        if (gMarkTotal === 0) return;
        gBoard[i][j].isMarked = true;
        gMarkTotal--;
    }
    elCell = document.querySelector('.mark span');
    elCell.innerText = gMarkTotal;
    renderBoard(gBoard);

}


// the function Checks how many mines are in the neighbours of a specific cell:
function setMinesNegsCount(board, cellI, cellJ) {
    var neighsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellI) continue
            if (gBoard[i][j].isMine) neighsCount++
        }
    }
    // console.log(neighsCount);
    return neighsCount;
}


// console.log(setMines(gBoard1, minesTotal))
// the function Sets the mines in the chosen gBoard:
function setMines(board, minesTotal) {
    for (var i = 0; i < minesTotal; i++) { // loop the minesTotal variable according to the chosen board length
        var cMineI = getRandomIntInclusive(0, board.length);
        var cMineJ = getRandomIntInclusive(0, board[0].length);
        if (!gBoard[cMineI][cMineJ].isMine) {
            gBoard[cMineI][cMineJ].isMine = true;
        } else i--;
        //if i step on a mine, the cell.isMine turns to true and i decrease the minesTotal according to that.
    }

}

// Set Timer with minutes & seconds
function setTimer() {
    var minutesLabel = document.querySelector(".minutes");
    var secondsLabel = document.querySelector(".seconds");
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    totalSeconds++
}

// selected level (easy / medium / hard)
function selectedLevel(level) {
    switch (level) {
        case 'easy':
            // restartGame();
            gBoardSize = 4;
            minesTotal = 2;
            gLifeTotal = 2;
            initGame();
            break;
        case 'medium':
            // restartGame();
            gBoardSize = 8;
            minesTotal = 8;
            gLifeTotal = 3;
            initGame();

            break;
        case 'hard':
            // restartGame();
            gBoardSize = 12;
            minesTotal = 12;
            gLifeTotal = 4;
            initGame();
            break;
    }

}


function expandedCells(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellI && j === cellI) continue
            gBoard[i][j].isShown = true;
            if (gBoard[i][j].isMine || gBoard[i][j].isShown) return
        }
    }
}


function restartGame() {
    var minutes = document.querySelector(".minutes");
    var seconds = document.querySelector(".seconds");
    minutes.innerText = '00';
    seconds.innerText = '00';
    clearInterval(gGameInterval);
    document.querySelector('.smiley').innerText = '🤠';
    shownCellsTotal = 0;
    totalSeconds = 0;
    clicksCounter = 0;
    isAlive()
}


function gameOver() {
    var isLiving = document.querySelector('.alive span')
    isLiving.innerText = 0;
    shownCellsTotal = 0;
    gameIsOn = false;
    
    clearInterval(gGameInterval);
    gameIsOn = false;
    document.querySelector('.smiley').innerText = '🤯';

}


function isAlive() {
    var isLiving = document.querySelector('.alive span')
    if (gLifeTotal > 0) {
        isLiving.innerText = gLifeTotal;
    } else gLifeTotal === 0

}


function winGame() {
    clearInterval(gGameInterval);
    document.querySelector('.victory').style.display = 'block'
    document.querySelector('.victory').innerText = '🤘😎 You Won!'


}


function countCellsShown() {
    shownCellsTotal = 1;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown && !gBoard[i][j].isMine) {
                shownCellsTotal++;
            }
        }
    }
}
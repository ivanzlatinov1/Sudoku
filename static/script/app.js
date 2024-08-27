document.getElementById("dark-mode").addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

const startScreen = document.querySelector('#start-screen');
const gameScreen = document.querySelector('#game-screen');
const pauseScreen = document.querySelector('#pause-screen')
const resultScreen = document.querySelector('#result-screen');

const nameInput = document.querySelector('#input-name');
const playerName = document.querySelector('#player-name');
const gameLevel = document.querySelector('#game-level');
const gameTime = document.querySelector('#game-time');

const resultTime = document.querySelector('#result-time');

let levelIndex = 0;
let level = CONSTANTS.LEVEL[levelIndex];

let timer = null;
let pause = false;
let seconds = 0;

let sudokuGame = undefined;
let sudokuAnswer = undefined;

let selectedCell = -1;

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const createCells = () => {
    const sudokuGrid = document.querySelector('.main-sudoku-grid');
    for (let i = 1; i <= 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('main-grid-cell');
        sudokuGrid.appendChild(cell);
    }
}

createCells();
const cells = document.querySelectorAll('.main-grid-cell');


const initializeNumbers = () => {
    const numsDiv = document.querySelector('.numbers');
    for (let i = 0; i < 9; i++) {
        const num = document.createElement('div');
        num.classList.add('number');
        num.textContent = i + 1;
        numsDiv.appendChild(num);
    }

    const btnDelete = document.createElement('div');
    btnDelete.classList.add('delete');
    btnDelete.id = 'btn-delete';
    btnDelete.textContent = 'X';
    numsDiv.appendChild(btnDelete);
}

initializeNumbers();

const initializeGameGrid = () => {
    let index = 0;
    for (let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANTS.GRID_SIZE);
        let col = i % CONSTANTS.GRID_SIZE;
        if (row === 2 || row === 5) {
            cells[index].style.marginBottom = '10px';
        }
        if (col === 2 || col === 5) {
            cells[index].style.marginRight = '10px';
        }

        index++;
    }
}

const setPlayerName = (name) => {
    localStorage.setItem('player_name', name);
}

const getPlayerName = () => {
    localStorage.getItem('player_name');
}

const showTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}

const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const initializeSudoku = () => {
    clearSudoku();
    resetBackground();

    sudokuGame = generateSudoku(level);
    sudokuAnswer = [...sudokuGame.question];

    seconds = 0;
    saveGameInfo();

    for (let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANTS.GRID_SIZE);
        let col = i % CONSTANTS.GRID_SIZE;

        cells[i].setAttribute('data-value', sudokuGame.question[row][col]);

        if (sudokuGame.question[row][col] !== 0) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = sudokuGame.question[row][col];
        }
    }
}

const loadSudoku = () => {
    let game = getGameInfo();

    gameLevel.innerHTML = CONSTANTS.LEVEL_NAME[game.level];

    sudokuGame = game.sudokuGame;

    sudokuAnswer = sudokuGame.answer;

    seconds = game.seconds;
    gameTime.innerHTML = showTime(seconds);

    levelIndex = game.level;

    for (let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANTS.GRID_SIZE);
        let col = i % CONSTANTS.GRID_SIZE;
        
        cells[i].setAttribute('data-value', sudokuAnswer[row][col]);
        cells[i].innerHTML = sudokuAnswer[row][col] !== 0 ? sudokuAnswer[row][col] : '';
        if (sudokuGame.question[row][col] !== 0) {
            cells[i].classList.add('filled');
        }
    }
}

const hoverBackground = (index) => {
    let row = Math.floor(index / CONSTANTS.GRID_SIZE);
    let col = index % CONSTANTS.GRID_SIZE;

    let boxStartRow = row - row % 3;
    let boxStartCol = col - col % 3;

    for (let i = 0; i < CONSTANTS.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANTS.BOX_SIZE; j++) {
            let cell = cells[9 * (boxStartRow + i) + (boxStartCol + j)];
            cell.classList.add('hover');
        }
    }

    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while (index - step >= row * 9) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
    while (index + step < row * 9 + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
}

const resetBackground = () => {
    cells.forEach(el => el.classList.remove('hover'));
}

const initCellsEvent = () => {
    cells.forEach((el, index) => {
        el.addEventListener('click', () => {
            if (!el.classList.contains('filled')) {
                cells.forEach(el => el.classList.remove('selected'));

                selectedCell = index;
                el.classList.remove('err');
                el.classList.add('selected');
                resetBackground();
                hoverBackground(index);
            }
        });
    });
}


const startGame = () => {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    playerName.innerHTML = nameInput.value.trim();
    setPlayerName(nameInput.value.trim());

    gameLevel.innerHTML = CONSTANTS.LEVEL_NAME[levelIndex];

    seconds = 0;
    showTime(seconds);

    timer = setInterval(() => {
        if (!pause) {
            seconds += 1;
            gameTime.innerHTML = showTime(seconds);
        }
    }, 1000)
}

const checkError = (value) => {
    const addError = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500)
        }
    }

    let index = selectedCell;

    let row = Math.floor(index / CONSTANTS.GRID_SIZE);
    let col = index % CONSTANTS.GRID_SIZE;

    let boxStartRow = row - row % 3;
    let boxStartCol = col - col % 3;

    for (let i = 0; i < CONSTANTS.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANTS.BOX_SIZE; j++) {
            let cell = cells[9 * (boxStartRow + i) + (boxStartCol + j)];
            if (!cell.classList.contains('selected')) {
                addError(cell);
            }
        }
    }

    let step = 9;
    while (index - step >= 0) {
        addError(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addError(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= row * 9) {
        addError(cells[index - step]);
        step += 1;
    }

    step = 1;
    while (index + step < row * 9 + 9) {
        addError(cells[index + step]);
        step += 1;
    }
}

const removeError = () => cells.forEach(el => el.classList.remove('err'));

const saveGameInfo = () => {
    let game = {
        level: levelIndex,
        seconds: seconds,
        sudokuGame: {
            original: sudokuGame.original,
            question: sudokuGame.question,
            answer: sudokuAnswer
        }
    }
    localStorage.setItem('game', JSON.stringify(game));
}

const removeGameInfo = () => {
    localStorage.removeItem('game');
    gameScreen.classList.remove('active');
    document.querySelector('#btn-continue').style.display = "none";
}

const isGameWon = () => {
    for (let row = 0; row < CONSTANTS.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANTS.GRID_SIZE; col++) {
            let value = sudokuAnswer[row][col];

            if (value === CONSTANTS.UNASSIGNED || !isSafe(sudokuAnswer, row, col, value)) {
                return false;
            }
        }
    }
    console.log("Game won!");
    return true;
};




const showResult = () => {
    clearInterval(timer);
    resultScreen.classList.add('active');
    resultTime.innerHTML = showTime(seconds);
}

const numberInputs = document.querySelectorAll('.number');

const initializeNumbersInputEvent = () => {
    numberInputs.forEach((el, index) => {
        el.addEventListener('click', () => {
            if (!cells[selectedCell].classList.contains('filled')) {
                cells[selectedCell].innerHTML = index + 1;
                cells[selectedCell].setAttribute('data-value', index + 1);

                let row = Math.floor(selectedCell / CONSTANTS.GRID_SIZE);
                let col = selectedCell % CONSTANTS.GRID_SIZE;
                sudokuAnswer[row][col] = index + 1;

                saveGameInfo();

                removeError();
                checkError(index + 1);
                cells[selectedCell].classList.add('zoom');
                setTimeout(() => {
                    cells[selectedCell].classList.remove('zoom');
                }, 500);

                if (isGameWon()) {
                    removeGameInfo();
                    showResult();
                }
            }
        });
    });
}

const returnToStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    startScreen.classList.add('active');
    gameScreen.classList.remove('active');
    pauseScreen.classList.remove('active');
    resultScreen.classList.remove('active');
}

document.querySelector('#btn-level').addEventListener('click', (event) => {
    levelIndex = (levelIndex + 1 > CONSTANTS.LEVEL.length - 1) ? 0 : levelIndex + 1;
    level = CONSTANTS.LEVEL[levelIndex];
    event.target.innerHTML = CONSTANTS.LEVEL_NAME[levelIndex];
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        initializeSudoku();
        startGame();
    }
    else {
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500);
    }
});

document.querySelector('#btn-continue').addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        loadSudoku();
        startGame();
    } else {
        nameInput.classList.add('input-err');
        setTimeout(() => {
            nameInput.classList.remove('input-err');
            nameInput.focus();
        }, 500);
    }
});

document.querySelector('.pause-btn').addEventListener('click', () => {
    pauseScreen.classList.add('active');
    pause = true;
});

document.querySelector('#btn-resume').addEventListener('click', () => {
    pauseScreen.classList.remove('active');
    pause = false;
});

document.querySelector('#btn-new-game').addEventListener('click', () => {
    returnToStartScreen();
});

document.querySelector('#btn-new-game-2').addEventListener('click', () => {
    returnToStartScreen();
});

document.querySelector('#btn-delete').addEventListener('click', () => {
    cells[selectedCell].textContent = '';
    cells[selectedCell].setAttribute('data-value', 0);
    let row = Math.floor(selectedCell / CONSTANTS.GRID_SIZE);
    let col = selectedCell % CONSTANTS.GRID_SIZE;

    sudokuAnswer[row][col] = 0;
    removeError();
});

document.addEventListener('click', (event) => {
    const gameScreen = document.querySelector('#game-screen');

    if (!gameScreen.contains(event.target)) {
        resetBackground();

        cells.forEach(cell => cell.classList.remove('selected'));

        selectedCell = -1;
    }
});


const initialize = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkMode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', darkMode ? '#1a1a2e' : '#fff');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    initializeGameGrid();
    initCellsEvent();
    initializeNumbersInputEvent();

    if (getPlayerName()) {
        nameInput.value = getPlayerName();
    }
    else {
        nameInput.focus();
    }
}

initialize();
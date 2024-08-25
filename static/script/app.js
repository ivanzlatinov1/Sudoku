document.getElementById("dark-mode").addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

const nameInput = document.querySelector('#input-name');
const startScreen = document.querySelector('#start-screen');
const gameScreen = document.querySelector('#game-screen');
const pauseScreen = document.querySelector('#pause-screen')

const playerName = document.querySelector('#player-name');
const gameLevel = document.querySelector('#game-level');
const gameTime = document.querySelector('#game-time');

let levelIndex = 0;
let level = CONSTANTS.LEVEL[levelIndex];

let timer = null;
let pause = false;
let seconds = 0;

let sudokuGame = undefined;
let sudokuAnswer = undefined;

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const createCells = () => {
   const sudokuGrid = document.querySelector('.main-sudoku-grid');
   for(let i = 1; i <= 81; i++)
   {
        const cell = document.createElement('div');
        cell.classList.add('main-grid-cell');
        sudokuGrid.appendChild(cell);
   }
}

createCells();
const cells = document.querySelectorAll('.main-grid-cell');

const initializeGameGrid = () => {
    let index = 0;
    for(let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++)
    {
        let row = Math.floor(i / CONSTANTS.GRID_SIZE);
        let col = i % CONSTANTS.GRID_SIZE;
        if(row  === 2 || row === 5)
        {
            cells[index].style.marginBottom = '10px';
        }
        if(col === 2 || col === 5)
        {
            cells[index].style.marginRight = '10px';
        }

        index++;
    }
}

const initializeNumbers = () => {
    const numsDiv = document.querySelector('.numbers');
    for(let i = 0; i < 9; i++)
    {
        const num = document.createElement('div');
        num.classList.add('number');
        num.textContent = i + 1;
        numsDiv.appendChild(num);
    }

    const btnDelete = document.createElement('div');
    btnDelete.classList.add('number');
    btnDelete.classList.add('delete');
    btnDelete.id = 'btn-delete';
    btnDelete.textContent = 'X';
    numsDiv.appendChild(btnDelete);
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
    for(let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const initializeSudoku = () => {
    clearSudoku();

    sudokuGame = generateSudoku(level);
    sudokuAnswer = [...sudokuGame.question];

    console.table(sudokuAnswer);

    for(let i = 0; i < Math.pow(CONSTANTS.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANTS.GRID_SIZE);
        let col = i % CONSTANTS.GRID_SIZE;

        cells[i].setAttribute('data-value', sudokuGame.question[row][col]);

        if(sudokuGame.question[row][col] !== 0) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = sudokuGame.question[row][col];
        }
    }
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
        if(!pause)
        {
            seconds += 1;
            gameTime.innerHTML = showTime(seconds);
        }
    }, 1000)
}

const returnToStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    startScreen.classList.add('active');
    gameScreen.classList.remove('active');
    pauseScreen.classList.remove('active');
}

document.querySelector('#btn-level').addEventListener('click', (event) => {
    levelIndex = (levelIndex + 1 > CONSTANTS.LEVEL.length - 1) ? 0 : levelIndex + 1;
    level = CONSTANTS.LEVEL[levelIndex];
    event.target.innerHTML = CONSTANTS.LEVEL_NAME[levelIndex];
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if(nameInput.value.trim().length > 0)
    {
        initializeSudoku();
        startGame();
    }
    else
    {
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

const initialize = () => {
    const darkMode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkMode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', darkMode ? '#1a1a2e' : '#fff');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    initializeGameGrid();
    initializeNumbers();
}

initialize();